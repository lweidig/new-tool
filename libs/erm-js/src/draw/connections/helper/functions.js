import { GENERALIZATION_RADIUS } from '../../shapes/generalization';
import { SubsetLinkType } from '../subsetlink';

export function lowerCaseTypeWithoutNamespace(type) {
    return type.substring(type.indexOf(':') + 1).toLowerCase();
}

export function calculateOptimalConnectionPoints(
    sourceElement,
    targetElement,
    subsetLinkType,
) {
    const circularSource =
        subsetLinkType === SubsetLinkType.GENERALIZATION_TO_ENTITY;
    const circularTarget =
        subsetLinkType === SubsetLinkType.ENTITY_TO_GENERALIZATION;
    const sourcePoints = mapPoints(sourceElement, circularSource);
    const targetPoints = mapPoints(targetElement, circularTarget);

    let minDistance = Infinity;
    let optimalPoints;

    sourcePoints.forEach((sourcePoint) => {
        targetPoints.forEach((targetPoint) => {
            const distance = Math.sqrt(
                Math.pow(targetPoint.x - sourcePoint.x, 2) +
                    Math.pow(targetPoint.y - sourcePoint.y, 2),
            );

            if (distance < minDistance) {
                minDistance = distance;
                optimalPoints = {
                    source: sourcePoint,
                    target: targetPoint,
                };
            }
        });
    });

    if (circularSource) {
        optimalPoints.source = postProcessPoint(
            optimalPoints.source,
            optimalPoints.target,
        );
    }

    if (circularTarget) {
        optimalPoints.target = postProcessPoint(
            optimalPoints.target,
            optimalPoints.source,
        );
    }

    return optimalPoints;
}

function mapPoints(element, isCircular) {
    const sides = ['top', 'right', 'bottom', 'left'];
    return isCircular
        ? [
              {
                  x: element.x + GENERALIZATION_RADIUS,
                  y: element.y + GENERALIZATION_RADIUS,
              },
          ]
        : sides.map((side) => getConnectionPoint(element, side));
}

function getConnectionPoint(element, preferredConnectionPoint) {
    switch (preferredConnectionPoint) {
        case 'top':
            return {
                x: element.x + element.width / 2,
                y: element.y,
            };
        case 'left':
            return {
                x: element.x,
                y: element.y + element.height / 2,
            };
        case 'bottom':
            return {
                x: element.x + element.width / 2,
                y: element.y + element.height,
            };
        case 'right':
            return {
                x: element.x + element.width,
                y: element.y + element.height / 2,
            };
        default:
            throw new Error(
                `Unknown preferred connection point: ${preferredConnectionPoint}`,
            );
    }
}

/**
 * Move a point towards another point by a distance equal to GENERALIZATION_RADIUS.
 * @param {Object} point - The point to move.
 * @param {Object} referencePoint - The reference point to move towards.
 * @returns {Object} The new point moved towards the target.
 */
function postProcessPoint(point, referencePoint) {
    const vector = {
        x: referencePoint.x - point.x,
        y: referencePoint.y - point.y,
    };
    const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    const normalizedVector = {
        x: vector.x / length,
        y: vector.y / length,
    };

    return {
        x: point.x + normalizedVector.x * GENERALIZATION_RADIUS,
        y: point.y + normalizedVector.y * GENERALIZATION_RADIUS,
    };
}
