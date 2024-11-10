import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';

export function renderConstraint(element, _attrs) {
    const CONSTRAINT_TITLE_TILE_SIZE = 14;
    const width = element.width || 0;
    const height = element.height || 0;

    const constraint = svgCreate('g');

    const titleTile = svgCreate('rect');
    svgAttr(titleTile, {
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

    const titleTileText = svgCreate('text');
    svgAttr(titleTileText, {
        x: CONSTRAINT_TITLE_TILE_SIZE / 2,
        y: CONSTRAINT_TITLE_TILE_SIZE / 2,
        fill: '#FFFFFF',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '10px',
        'font-family': 'Arial, sans-serif',
    });
    titleTileText.textContent = 'C1';
    svgAppend(constraint, titleTileText);

    const constraintContent = svgCreate('rect');
    svgAttr(constraintContent, {
        x: CONSTRAINT_TITLE_TILE_SIZE,
        y: 0,
        width: width - CONSTRAINT_TITLE_TILE_SIZE,
        height: height,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    constraintContent.setAttribute('fill', '#FFFFFF');
    svgAppend(constraint, constraintContent);

    const constraintContentText = svgCreate('text', {
        x: CONSTRAINT_TITLE_TILE_SIZE + 5,
        y: 20,
        'font-size': '12px',
        'font-family': 'Arial, sans-serif',
        textAnchor: 'start',
    });
    constraintContentText.textContent =
        element.text || '<CONSTRAINT PLACEHOLDER>';
    svgAppend(constraint, constraintContentText);

    return constraint;
}
