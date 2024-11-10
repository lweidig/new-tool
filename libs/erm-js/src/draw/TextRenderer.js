import { attr as svgAttr, create as svgCreate } from 'tiny-svg';

const DEFAULT_FONT_SIZE = 12;
const LINE_HEIGHT_RATIO = 1.2;

/**
 * Renders text and computes text bounding boxes.
 */
export default function TextRenderer(config) {
    const defaultStyle = Object.assign(
        {
            fontFamily: '"Gill Sans", sans-serif',
            fontSize: DEFAULT_FONT_SIZE,
            fontWeight: 'normal',
            lineHeight: LINE_HEIGHT_RATIO,
        },
        (config && config.defaultStyle) || {},
    );

    /**
     * Create a layouted text element.
     *
     * @param {string} text
     * @param {Object} [options]
     *
     * @return {SVGElement} rendered text
     */
    this.createText = function (text, options) {
        const simpleTextSvg = svgCreate('text', defaultStyle);
        svgAttr(simpleTextSvg, options);
        simpleTextSvg.textContent = text;
        return simpleTextSvg;
    };

    /**
     * Create a layouted textBox div served inside a SVGElement element.
     *
     * @param {string} textContent
     * @param {Object} [options]
     *
     * @return {SVGElement} rendered SVGElement containing a textBox div-Element
     */
    this.createTextBox = function (textContent, options) {
        const textBox = svgCreate('foreignObject', {
            x: options.x,
            y: options.y,
            width: options.width,
            height: options.height,
        });

        const div = document.createElement('div');
        div.style.cssText = `
            width: 100%;
            height: 100%;
            font-family: ${options.fontFamily || defaultStyle.fontFamily};
            font-size: ${options.fontSize || defaultStyle.fontSize}px;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            overflow: hidden;
            color: ${options.color || defaultStyle.color || 'black'};
            padding: 2px;
            box-sizing: border-box;
        `;
        div.textContent = textContent;
        textBox.appendChild(div);
        return textBox;
    };

    /**
     * Get default text style.
     */
    this.getDefaultStyle = function () {
        return defaultStyle;
    };
}

TextRenderer.$inject = ['config.textRenderer'];
