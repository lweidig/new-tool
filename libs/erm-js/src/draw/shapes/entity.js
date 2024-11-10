import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export function renderEntity(textRenderer, element, _attrs) {
    const { width, height, businessObject } = element;

    const entity = svgCreate('g');

    const rect = svgCreate('rect', {
        x: 0,
        y: 0,
        width: width,
        height: height,
        rx: 10,
        ry: 10,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    svgAppend(entity, rect);

    const nameRow = textRenderer.createText(businessObject.name, {
        x: width / 2,
        y: 20,
        fill: '#000000',
        fontSize: 14,
        textAnchor: 'middle',
    });
    svgAppend(entity, nameRow);

    const divider = svgCreate('line', {
        x1: 0,
        y1: 30,
        x2: width,
        y2: 30,
        stroke: '#000000',
        strokeWidth: 1,
    });
    svgAppend(entity, divider);

    const { attributes } = businessObject;
    if (attributes && attributes.length > 0) {
        const attributesTable = svgCreate('g');
        const ROW_HEIGHT = 20;
        attributes.forEach((attribute, index) => {
            const row = textRenderer.createText(
                `${attribute.name}: ${attribute.dataType}`,
                {
                    x: 10,
                    y: 50 + index * ROW_HEIGHT,
                    fill: '#000000',
                    fontSize: 12,
                },
            );
            svgAppend(attributesTable, row);
        });
        svgAppend(entity, attributesTable);
    }

    return entity;
}
