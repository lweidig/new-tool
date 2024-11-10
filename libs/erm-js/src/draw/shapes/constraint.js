import { append as svgAppend, create as svgCreate } from 'tiny-svg';

export function renderConstraint(textRenderer, element, _attrs) {
    const CONSTRAINT_TITLE_TILE_SIZE = 14;
    const { width, height, businessObject } = element;

    const constraint = svgCreate('g');

    const titleTile = svgCreate('rect', {
        x: 0,
        y: 0,
        width: CONSTRAINT_TITLE_TILE_SIZE,
        height: CONSTRAINT_TITLE_TILE_SIZE,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#000000',
    });
    titleTile.setAttribute('fill', '#FFFFFF');
    svgAppend(constraint, titleTile);

    const titleTileText = textRenderer.createText(
        `C${businessObject.titleIndex}`,
        {
            x: CONSTRAINT_TITLE_TILE_SIZE / 2,
            y: CONSTRAINT_TITLE_TILE_SIZE / 2,
            fill: '#FFFFFF',
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            'font-size': '10px',
            'font-family': 'Arial, sans-serif',
        },
    );
    svgAppend(constraint, titleTileText);

    const constraintContent = svgCreate('rect', {
        x: CONSTRAINT_TITLE_TILE_SIZE,
        y: 0,
        width: width - CONSTRAINT_TITLE_TILE_SIZE,
        height: height,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    svgAppend(constraint, constraintContent);
    const textBox = textRenderer.createTextBox(businessObject.textContent, {
        x: CONSTRAINT_TITLE_TILE_SIZE + 5,
        y: 5,
        width: width - CONSTRAINT_TITLE_TILE_SIZE - 5,
        height: height - 5,
    });
    svgAppend(constraint, textBox);

    return constraint;
}
