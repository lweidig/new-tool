import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export const GENERALIZATION_RADIUS = 20;
const GENERALIZATION_TEXT_ATTRIBUTES = {
    x: GENERALIZATION_RADIUS,
    y: GENERALIZATION_RADIUS,
    fill: '#000000',
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '18px',
};

export function renderGeneralization(textRenderer, element, _attrs) {
    const generalization = svgCreate('g');
    const circle = svgCreate('circle', {
        cx: GENERALIZATION_RADIUS,
        cy: GENERALIZATION_RADIUS,
        r: GENERALIZATION_RADIUS,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    svgAppend(generalization, circle);

    if (element.type === 'erm:DisjunctGeneralization') {
        const disjunctChar = textRenderer.createText(
            'd',
            GENERALIZATION_TEXT_ATTRIBUTES,
        );
        svgAppend(generalization, disjunctChar);
    }
    if (element.type === 'erm:OverlappingGeneralization') {
        const overlappingChar = textRenderer.createText(
            'o',
            GENERALIZATION_TEXT_ATTRIBUTES,
        );
        svgAppend(generalization, overlappingChar);
    }

    return generalization;
}
