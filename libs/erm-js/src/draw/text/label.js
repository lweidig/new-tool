import { append as svgAppend, classes as svgClasses } from 'tiny-svg';

export function renderLabel(parentGfx, labelRequestingElement, textRenderer) {
    const options = standardTextLayoutConfig(
        labelRequestingElement.width,
        labelRequestingElement.height,
    );

    const text = textRenderer.createText(
        labelRequestingElement?.name || '',
        options,
    );

    svgClasses(text).add('djs-label');

    svgAppend(parentGfx, text);

    // TODO: ensure rendering label text in the middle of the shape via post processing

    return text;
}

const standardTextLayoutConfig = (elementWidth, elementHeight) => {
    return {
        align: 'center-middle',
        box: {
            width: elementWidth,
            height: elementHeight,
        },
        fitBox: false,
        padding: {
            left: parseInt(elementWidth * 0.3),
        },
    };
};
