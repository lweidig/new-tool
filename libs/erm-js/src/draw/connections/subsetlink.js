import { createLine } from 'diagram-js/lib/util/RenderUtil';
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';
import {
    addConnectionClasses,
    getAdjustedWaypoints,
    lowerCaseTypeWithoutNamespace,
} from './helper/functions';

export const SubsetLinkType = Object.freeze({
    ENTITY_TO_GENERALIZATION: 'entity-to-generalization',
    GENERALIZATION_TO_ENTITY: 'generalization-to-entity',
});

export function renderSubsetLink(connection, attrs) {
    const subsetLinkType = calculateSubsetLinkType(connection);
    const adjustedWaypoints = getAdjustedWaypoints(connection, subsetLinkType);

    const subsetLink = svgCreate('g');
    const line = createLine(adjustedWaypoints, {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 2,
        fill: 'none',
    });
    svgAppend(subsetLink, line);

    switch (subsetLinkType) {
        case SubsetLinkType.ENTITY_TO_GENERALIZATION:
            addHalfCircleToSubsetLink(subsetLink, adjustedWaypoints, attrs);
            break;
        case SubsetLinkType.GENERALIZATION_TO_ENTITY:
            if (connection.source.businessObject.isTotal) {
                thickenLine(line, adjustedWaypoints, attrs);
            } else {
                svgAttr(line, { strokeWidth: 1 });
            }
            break;
    }
    addConnectionClasses(subsetLink, connection);

    return subsetLink;
}

function calculateSubsetLinkType(connection) {
    const sourceType = lowerCaseTypeWithoutNamespace(connection.source.type);
    const targetType = lowerCaseTypeWithoutNamespace(connection.target.type);

    if (sourceType.includes('generalization') && targetType === 'entity') {
        return SubsetLinkType.GENERALIZATION_TO_ENTITY;
    }

    if (sourceType === 'entity' && targetType.includes('generalization')) {
        return SubsetLinkType.ENTITY_TO_GENERALIZATION;
    }

    throw new Error(
        `Unsupported subset link type: ${sourceType} to ${targetType}`,
    );
}

function addHalfCircleToSubsetLink(subsetLink, adjustedWaypoints, attrs) {
    const source = adjustedWaypoints[0];
    const target = adjustedWaypoints[adjustedWaypoints.length - 1];
    const halfCircle = svgCreate('path');
    const RADIUS = 10;

    const halfCircleX = source.x + (target.x - source.x) / 3;
    const halfCircleY = source.y + (target.y - source.y) / 3;

    const angle = Math.atan2(target.y - source.y, target.x - source.x);

    // Calculate the start and end points of the half-circle
    const startX = halfCircleX - RADIUS * Math.cos(angle + Math.PI / 2);
    const startY = halfCircleY - RADIUS * Math.sin(angle + Math.PI / 2);
    const endX = halfCircleX + RADIUS * Math.cos(angle + Math.PI / 2);
    const endY = halfCircleY + RADIUS * Math.sin(angle + Math.PI / 2);

    const pathData = `
        M ${startX}, ${startY}
        A ${RADIUS},${RADIUS} 0 0,${angle > 0 ? 1 : 0} ${endX},${endY}
    `;

    svgAttr(halfCircle, {
        d: pathData,
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 2,
        fill: 'none',
    });

    svgAppend(subsetLink, halfCircle);
}

function thickenLine(line) {
    svgAttr(line, {
        stroke: '#000000',
        strokeWidth: 8,
        fill: 'none',
    });

    const innerLine = svgCreate('path');
    svgAttr(innerLine, {
        d: line.getAttribute('d'),
        stroke: '#FFFFFF',
        strokeWidth: 6,
        fill: 'none',
    });

    svgAppend(line.parentNode, innerLine);
}
