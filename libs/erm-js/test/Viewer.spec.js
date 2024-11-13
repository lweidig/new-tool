import { simple } from './fixtures';
import TestContainer from 'mocha-test-container-support';
import Viewer from '../src/Viewer';

describe('Viewer', function () {
    let container;

    beforeEach(function () {
        container = TestContainer.get(this);
    });

    describe('#saveJson', function () {
        it('should export JSON', async () => {
            // given
            const diagram = JSON.stringify(simple);

            const viewer = new Viewer({ container: container });

            await viewer.importJson(diagram);

            const json = await viewer.saveJson();

            const inputParsed = JSON.parse(diagram);
            const exportedParsed = JSON.parse(json);

            inputParsed.cells.forEach((inputCell, index) => {
                const exportedCell = exportedParsed.cells[index];
                expect(exportedCell.id).to.equal(inputCell.id);
                expect(exportedCell.$type).to.equal(inputCell.$type);
                expect(exportedCell.name).to.equal(inputCell.name);
                if (
                    [
                        'erm:Comment',
                        'erm:Constraint',
                        'erm:Entity',
                        'erm:Relationship',
                        'erm:Generalization',
                        'erm:DisjunctGeneralization',
                        'erm:OverlappingGeneralization',
                    ].includes(exportedCell.$type)
                ) {
                    expect(exportedCell.x).to.be.a('number');
                    expect(exportedCell.y).to.be.a('number');
                    expect(exportedCell.width).to.be.a('number');
                    expect(exportedCell.height).to.be.a('number');
                }
            });
        });

        it('should emit <saveJson.*> events', async () => {
            // given
            const diagram = JSON.stringify(simple);
            const events = [];

            const viewer = new Viewer({ container: container });

            viewer.on(
                ['saveJson.start', 'saveJson.serialized', 'saveJson.done'],
                (e) => {
                    events.push([
                        e.type,
                        Object.keys(e).filter((key) => key !== 'type'),
                    ]);
                },
            );

            // when
            await viewer.importJson(diagram);
            await viewer.saveJson();

            // then
            expect(events).to.eql([
                ['saveJson.start', ['root']],
                ['saveJson.serialized', ['json']],
                ['saveJson.done', ['error', 'json']],
            ]);
        });
    });
});
