import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export function renderRelationship(textRenderer, element, _attrs) {
    const { width, height } = element;
    const middleX = width / 2;
    const middleY = height / 2;
    const diamondPath = `M${middleX},0 L${width},${middleY} L${middleX},${height} L0,${middleY} Z`;

    const relationship = svgCreate('g');
    const diamond = svgCreate('path', {
        d: diamondPath,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    svgAppend(relationship, diamond);

    const text = textRenderer.createText(element.name, {
        x: middleX,
        y: middleY,
        fill: '#000000',
        textAnchor: 'middle',
        fontSize: 14,
        'dominant-baseline': 'middle',
    });
    svgAppend(relationship, text);

    return relationship;
}
