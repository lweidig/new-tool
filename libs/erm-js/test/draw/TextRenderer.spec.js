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
                x: 10,
                y: 20,
                fill: '#000000',
                fontSize: 14,
                fontWeight: 'bold',
                textAnchor: 'middle',
                dominantBaseline: 'middle',
            };

            // when
            const textElement = textRenderer.createText(text, options);

            // then
            expect(textElement.tagName).to.equal('text');
            expect(textElement.textContent).to.equal(text);
            expect(textElement.style.fontSize).to.equal('14px');
            expect(textElement.style.fontWeight).to.equal('bold');
        });
    });

    describe('createTextBox', function () {
        it('should create a textBox correct position and word-wrap by default', function () {
            // given
            const text = 'Test Text';
            const options = {
                x: 10,
                y: 20,
                width: 100,
                height: 50,
                fill: '#000000',
                fontSize: 14,
                textAnchor: 'middle',
                dominantBaseline: 'middle',
            };

            // when
            const svgElement = textRenderer.createTextBox(text, options);

            // then
            expect(svgElement.tagName).to.equal('foreignObject');
            expect(svgElement.childNodes).to.have.length(1);
            expect(svgElement.textContent).to.equal(text);
            expect(svgElement.childNodes[0].style.fontSize).to.equal('14px');
            expect(svgElement.childNodes[0].style.wordWrap).to.equal(
                'break-word',
            );
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
