import { createLine } from 'diagram-js/lib/util/RenderUtil';
import {
    append as svgAppend,
    classes as svgClasses,
    attr as svgAttr,
    create as svgCreate,
} from 'tiny-svg';
import {
    calculateOptimalConnectionPoints,
    lowerCaseTypeWithoutNamespace,
} from './helper/functions';

export const SubsetLinkType = Object.freeze({
    ENTITY_TO_GENERALIZATION: 'entity-to-generalization',
    GENERALIZATION_TO_ENTITY: 'generalization-to-entity',
});

export function renderSubsetLink(visuals, connection, attrs) {
    const subsetLink = svgCreate('g');
    const { waypoints, source, target } = connection;
    const subsetLinkType = calculateSubsetLinkType(source, target);
    const optimalPoints = calculateOptimalConnectionPoints(
        source,
        target,
        subsetLinkType,
    );
    const adjustedWaypoints = [...waypoints];

    if (waypoints.length >= 2) {
        adjustedWaypoints[0] = optimalPoints.source;
        adjustedWaypoints[adjustedWaypoints.length - 1] = optimalPoints.target;
    }

    const style = {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 2,
        fill: 'none',
    };

    // Create the base line with adjusted waypoints
    const line = createLine(adjustedWaypoints, style);
    svgAppend(subsetLink, line);

    // Add a half-circle if pointsTowardsGeneralization is true
    switch (subsetLinkType) {
        case SubsetLinkType.ENTITY_TO_GENERALIZATION:
            addHalfCircleToSubsetLink(subsetLink, optimalPoints, attrs);
            break;
        case SubsetLinkType.GENERALIZATION_TO_ENTITY:
            if (source.businessObject.isTotal) {
                thickenLine(line, adjustedWaypoints, attrs);
            } else {
                svgAttr(line, {
                    strokeWidth: 1,
                });
            }
            break;
    }

    // Add classes based on the connection type
    svgClasses(subsetLink).add('erm-connection');
    svgClasses(subsetLink).add(
        `erm-${lowerCaseTypeWithoutNamespace(connection.type)}`,
    );

    svgAppend(visuals, subsetLink);

    return subsetLink;
}

function calculateSubsetLinkType(source, target) {
    const sourceType = lowerCaseTypeWithoutNamespace(source.type);
    const targetType = lowerCaseTypeWithoutNamespace(target.type);

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

function addHalfCircleToSubsetLink(subsetLink, optimalPoints, attrs) {
    const halfCircle = svgCreate('path');
    const radius = 10; // Adjust the radius as needed

    // Calculate a point closer to the source (e.g., 1/3 of the way from source to target)
    const closerX =
        optimalPoints.source.x +
        (optimalPoints.target.x - optimalPoints.source.x) / 3;
    const closerY =
        optimalPoints.source.y +
        (optimalPoints.target.y - optimalPoints.source.y) / 3;

    // Calculate the angle of the connection
    const angle = Math.atan2(
        optimalPoints.target.y - optimalPoints.source.y,
        optimalPoints.target.x - optimalPoints.source.x,
    );

    // Calculate the start and end points of the half-circle
    const startX = closerX - radius * Math.cos(angle + Math.PI / 2);
    const startY = closerY - radius * Math.sin(angle + Math.PI / 2);
    const endX = closerX + radius * Math.cos(angle + Math.PI / 2);
    const endY = closerY + radius * Math.sin(angle + Math.PI / 2);

    const pathData = `
        M ${startX}, ${startY}
        A ${radius},${radius} 0 0,${angle > 0 ? 1 : 0} ${endX},${endY}
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
    // Create a thick black line
    svgAttr(line, {
        stroke: '#000000', // Black rim
        strokeWidth: 8, // Thicker stroke width
        fill: 'none',
    });

    // Create a new path element for the white inner line
    const innerLine = svgCreate('path');
    const pathData = line.getAttribute('d'); // Get the path data from the original line

    svgAttr(innerLine, {
        d: pathData,
        stroke: '#FFFFFF', // White inner line
        strokeWidth: 6, // Slightly thinner stroke width
        fill: 'none',
    });

    // Append the inner line to the same parent as the original line
    const parent = line.parentNode;
    svgAppend(parent, innerLine);
}
