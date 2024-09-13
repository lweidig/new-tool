import { expect } from 'chai';
import TextRenderer from '../../src/draw/TextRenderer';

describe('TextRenderer', function () {
    let textRenderer;

    beforeEach(function () {
        textRenderer = new TextRenderer();
    });

    describe('createText', function () {
        it('should create a text element with correct attributes', function () {
            // given
            const text = 'Test Text';
            const options = {
                align: 'center-middle',
                padding: 5,
                style: { fontSize: '14px', fontWeight: 'bold' },
            };

            // when
            const textElement = textRenderer.createText(text, options);

            // then
            expect(textElement.tagName).to.equal('text');
            expect(textElement.textContent).to.equal(text);
            expect(textElement.getAttribute('text-anchor')).to.equal('middle');
            expect(textElement.style.fontSize).to.equal('14px');
            expect(textElement.style.fontWeight).to.equal('bold');
        });
    });

    describe('getDefaultStyle', function () {
        it('should return the default style object', function () {
            // when
            const defaultStyle = textRenderer.getDefaultStyle();

            // then
            expect(defaultStyle).to.have.property('fontFamily');
            expect(defaultStyle).to.have.property('fontSize');
            expect(defaultStyle).to.have.property('fontWeight');
        });
    });
});
