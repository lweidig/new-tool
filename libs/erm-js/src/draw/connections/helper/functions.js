export function lowerCaseTypeWithoutNamespace(type) {
    return type.substring(type.indexOf(':') + 1).toLowerCase();
}

export function calculateOptimalConnectionPoints(sourceElement, targetElement) {
    const sides = ['top', 'right', 'bottom', 'left'];
    const sourcePoints = sides.map((side) =>
        getConnectionPoint(sourceElement, side),
    );
    const targetPoints = sides.map((side) =>
        getConnectionPoint(targetElement, side),
    );

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

    return optimalPoints;
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
                'Unknown preferred connection point: '.concat(
                    preferredConnectionPoint,
                ),
            );
    }
}
