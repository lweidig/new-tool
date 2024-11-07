import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend } from 'tiny-svg';

export function renderNoteLink(visuals, connection, connectionStyle, attrs) {
    var line = createLine(
        connection.waypoints,
        Object.assign({}, connectionStyle, attrs || {}),
    );
    svgAppend(visuals, line);

    return line;
}
