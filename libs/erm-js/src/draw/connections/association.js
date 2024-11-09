import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { addConnectionClasses, getAdjustedWaypoints } from './helper/functions';

export function renderAssociation(connection, attrs) {
    const adjustedWaypoints = getAdjustedWaypoints(connection);
    const association = svgCreate('g');
    const line = createLine(adjustedWaypoints, {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 1,
        fill: 'none',
    });
    svgAppend(association, line);
    addConnectionClasses(association, connection);
    return association;
}
