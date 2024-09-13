import TextUtil from 'diagram-js/lib/util/Text';

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

    const textUtil = new TextUtil({
        style: defaultStyle,
    });

    /**
     * Create a layouted text element.
     *
     * @param {string} text
     * @param {TextLayoutConfig} [options]
     *
     * @return {SVGElement} rendered text
     */
    this.createText = function (text, options) {
        const svgElement = textUtil.createText(text, options || {});
        svgElement.setAttribute('text-anchor', 'middle');
        return svgElement;
    };

    /**
     * Get default text style.
     */
    this.getDefaultStyle = function () {
        return defaultStyle;
    };
}

TextRenderer.$inject = ['config.textRenderer'];
