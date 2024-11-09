import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { addConnectionClasses, getAdjustedWaypoints } from './helper/functions';

export function renderNoteLink(connection, attrs) {
    const adjustedWaypoints = getAdjustedWaypoints(connection);

    const line = createLine(adjustedWaypoints, {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 2,
        fill: 'none',
        strokeDasharray: '4 2',
    });
    addConnectionClasses(line, connection);

    return line;
}
