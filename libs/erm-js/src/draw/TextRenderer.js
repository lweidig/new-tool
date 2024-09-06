import TextUtil from 'diagram-js/lib/util/Text.js';

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

    this.createText = (text, options = {}) => {
        return textUtil.createText(text, options);
    };
}

TextRenderer.$inject = ['config.textRenderer'];
