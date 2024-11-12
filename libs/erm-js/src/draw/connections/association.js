import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import {
    addConnectionClasses,
    calculatePointOnLine,
    getAdjustedWaypoints,
} from './helper/functions';

const ENTITY_TO_CARDINALITY_SPACING = 40;

export function renderAssociation(textRenderer, connection, attrs) {
    const { minCardinality, maxCardinality } = connection.businessObject;
    const adjustedWaypoints = getAdjustedWaypoints(connection);
    const association = svgCreate('g');
    const line = createLine(adjustedWaypoints, {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 1,
        fill: 'none',
    });
    svgAppend(association, line);

    const cardinalityText = buildCardinalityText(
        minCardinality,
        maxCardinality,
    );

    if (cardinalityText !== ',') {
        const cardinalityPosition = calculatePointOnLine(
            adjustedWaypoints[0],
            adjustedWaypoints[adjustedWaypoints.length - 1],
            ENTITY_TO_CARDINALITY_SPACING,
        );

        const background = svgCreate('rect', {
            x: cardinalityPosition.x - 10,
            y: cardinalityPosition.y - 10,
            width: 20,
            height: 20,
            fill: '#ffffff',
        });
        svgAppend(association, background);

        const text = textRenderer.createText(cardinalityText, {
            x: cardinalityPosition.x,
            y: cardinalityPosition.y,
            fill: '#000000',
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
        });
        svgAppend(association, text);
    }
    addConnectionClasses(association, connection);
    return association;
}

function buildCardinalityText(minCardinality, maxCardinality) {
    const minText = isDrawable(minCardinality) ? minCardinality : '';
    const maxText = isDrawable(maxCardinality) ? maxCardinality : '';
    return minText + ',' + maxText;
}

function isDrawable(cardinality) {
    return cardinality === '*' || parseInt(cardinality, 10) >= 0;
}
