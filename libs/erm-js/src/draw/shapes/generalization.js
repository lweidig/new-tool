import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

export const GENERALIZATION_RADIUS = 20;
const GENERALIZATION_TEXT_ATTRIBUTES = {
    x: GENERALIZATION_RADIUS,
    y: GENERALIZATION_RADIUS,
    fill: '#000000',
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
    'font-size': '18px',
    'font-family': 'Arial, sans-serif',
};

export function renderGeneralization(element, _attrs) {
    const generalization = svgCreate('g');
    const circle = svgCreate('circle');

    svgAttr(circle, {
        cx: GENERALIZATION_RADIUS,
        cy: GENERALIZATION_RADIUS,
        r: GENERALIZATION_RADIUS,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    svgAppend(generalization, circle);

    if (element.type === 'erm:DisjunctGeneralization') {
        const disjunctChar = svgCreate('text', GENERALIZATION_TEXT_ATTRIBUTES);
        disjunctChar.textContent = 'd';
        svgAppend(generalization, disjunctChar);
    }
    if (element.type === 'erm:OverlappingGeneralization') {
        const overlappingChar = svgCreate(
            'text',
            GENERALIZATION_TEXT_ATTRIBUTES,
        );
        overlappingChar.textContent = 'o';
        svgAppend(generalization, overlappingChar);
    }

    return generalization;
}
