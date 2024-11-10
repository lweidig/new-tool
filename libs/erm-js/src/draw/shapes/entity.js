import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export function renderEntity(element, _textRenderer, _attrs) {
    const entity = svgCreate('g');

    const rect = renderRect(element);
    svgAppend(entity, rect);

    const nameRow = renderNameRow(element.businessObject.name, element.width);
    svgAppend(entity, nameRow);

    const divider = renderDivider(element.width);
    svgAppend(entity, divider);

    const { attributes } = element.businessObject;
    if (attributes && attributes.length > 0) {
        const attributesTable = renderAttributesTable(attributes);
        svgAppend(entity, attributesTable);
    }

    return entity;
}

function renderRect(element) {
    const rect = svgCreate('rect', {
        x: 0,
        y: 0,
        width: element.width,
        height: element.height,
        rx: 10,
        ry: 10,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    return rect;
}

function renderNameRow(name, width) {
    const nameRow = svgCreate('text', {
        x: width / 2,
        y: 20,
        fill: '#000000',
        fontSize: 14,
        fontWeight: 'bold',
        textAnchor: 'middle',
    });
    nameRow.textContent = name;
    return nameRow;
}

function renderDivider(width) {
    const divider = svgCreate('line', {
        x1: 0,
        y1: 30,
        x2: width,
        y2: 30,
        stroke: '#000000',
        strokeWidth: 1,
    });
    return divider;
}

function renderAttributesTable(attributes) {
    const table = svgCreate('g');
    const rowHeight = 20;
    attributes.forEach((attribute, index) => {
        const row = svgCreate('text', {
            x: 10,
            y: 50 + index * rowHeight,
            fill: '#000000',
            fontSize: 12,
        });
        row.textContent = `${attribute.name}: ${attribute.dataType}`;
        svgAppend(table, row);
    });
    return table;
}
