import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export function renderRelationship(element, _textRenderer, _attrs) {
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

    const text = svgCreate('text', {
        x: middleX,
        y: middleY + 3,
        'font-size': '12px',
        'font-family': 'Arial, sans-serif',
        textAnchor: 'middle',
    });
    text.textContent = element.name;
    svgAppend(relationship, text);

    return relationship;
}
