import coreModule from '../../src/core';
import rendererModule from '../../src/draw';
import { simple } from './draw.fixtures';
import { bootstrapViewer, inject } from './helper';

import { query as domQuery } from 'min-dom';

describe('draw - ErmRenderer', function () {
    const diagramJson = JSON.stringify(simple);

    const testModules = [coreModule, rendererModule];

    beforeEach(bootstrapViewer(diagramJson, { modules: testModules }));

    it('should render Entity', inject(function (elementRegistry) {
        // given
        const entityElement = elementRegistry.get('entity1');

        // when
        const entityGfx = elementRegistry.getGraphics(entityElement);

        // then
        const visual = domQuery('.djs-visual', entityGfx);
        expect(visual).to.exist;

        const rect = domQuery('rect', visual);
        expect(rect).to.exist;
        expect(rect.getAttribute('rx')).to.equal('10');
        expect(rect.getAttribute('ry')).to.equal('10');
    }));

    it('should render Relationship', inject(function (elementRegistry) {
        // given
        const relationshipElement = elementRegistry.get('relationship1');

        // when
        const relationshipGfx =
            elementRegistry.getGraphics(relationshipElement);

        // then
        const visual = domQuery('.djs-visual', relationshipGfx);
        expect(visual).to.exist;

        const diamond = domQuery('path', visual);
        expect(diamond).to.exist;
        expect(diamond.getAttribute('d')).to.match(/^M.*L.*L.*L.*Z$/);
    }));

    it('should render Association', inject(function (elementRegistry) {
        // given
        const associationElement = elementRegistry.get('association1');

        // when
        const associationGfx = elementRegistry.getGraphics(associationElement);

        // then
        const visual = domQuery('.djs-visual', associationGfx);
        expect(visual).to.exist;
        const ermConnection = domQuery('.erm-connection', associationGfx);
        expect(ermConnection).to.exist;
        const ermAssociation = domQuery('.erm-association', associationGfx);
        expect(ermAssociation).to.exist;
        const path = domQuery('path', visual);
        expect(path).to.exist;
    }));

    it('should render labels', inject(function (elementRegistry) {
        // given
        const entityElement = elementRegistry.get('entity1');

        // when
        const entityGfx = elementRegistry.getGraphics(entityElement);

        // then
        const text = domQuery('text', entityGfx);
        expect(text).to.exist;
        expect(text.textContent).to.equal(entityElement.businessObject.name);
    }));
});
