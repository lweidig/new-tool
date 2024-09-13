import { expect } from 'chai';

import TestContainer from 'mocha-test-container-support';

import Diagram from 'diagram-js/lib/Diagram';
import ErmModdle from '@new-tool/erm-moddle';

import { importErmDiagram } from '../../src/import/ErmImporter';

import CoreModule from '../../src/core';
import { simple, root_without_cells } from './import.fixtures';

describe('import - ErmImporter', function () {
    function createDiagram(container, modules) {
        return new Diagram({
            canvas: { container: container },
            modules: modules,
        });
    }

    let diagram;

    beforeEach(function () {
        diagram = createDiagram(TestContainer.get(this), [CoreModule]);
    });

    async function runImport(diagram, jsonString) {
        const moddle = new ErmModdle();
        const modelInstance = await moddle.fromJson(jsonString);
        return importErmDiagram(diagram, modelInstance);
    }

    describe('import erm', function () {
        it('should import erm diagram', function () {
            // given
            const jsonString = JSON.stringify(simple);

            const events = [];

            diagram.get('eventBus').on('ermElement.added', function (e) {
                events.push({
                    type: 'add',
                    name: e.element.name,
                    id: e.element.id,
                });
            });

            // when
            return runImport(diagram, jsonString).then(function () {
                // then
                expect(events).to.have.length(5);

                expect(events[0].name).to.equal('Customer');
                expect(events[1].name).to.equal('Product');
                expect(events[2].name).to.equal('buys');
                expect(events[3].name).to.equal('Customer -> buys');
                expect(events[4].name).to.equal('buys -> Product');

                const elementRegistry = diagram.get('elementRegistry');
                expect(elementRegistry.get('entity1')).to.exist;
                expect(elementRegistry.get('entity2')).to.exist;
                expect(elementRegistry.get('relationship1')).to.exist;
                expect(elementRegistry.get('association1')).to.exist;
                expect(elementRegistry.get('association2')).to.exist;
            });
        });

        it('should handle empty cells', function () {
            // given
            const jsonString = JSON.stringify(root_without_cells);

            // when
            return runImport(diagram, jsonString).then(function (result) {
                // then
                expect(result.warnings).to.have.length(1);
                expect(result.warnings[0]).to.eql(
                    'no cells defined inside provided erm:Root - id: root1',
                );
            });
        });
    });
});
