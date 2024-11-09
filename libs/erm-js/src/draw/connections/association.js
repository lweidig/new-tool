import { createLine } from 'diagram-js/lib/util/RenderUtil';
import { append as svgAppend, classes as svgClasses } from 'tiny-svg';
import {
    calculateOptimalConnectionPoints,
    lowerCaseTypeWithoutNamespace,
} from './helper/functions';

export function renderAssociation(visuals, connection, attrs) {
    const { waypoints, source, target } = connection;
    const optimalPoints = calculateOptimalConnectionPoints(source, target);
    const adjustedWaypoints = [...waypoints];

    if (waypoints.length >= 2) {
        adjustedWaypoints[0] = optimalPoints.source;
        adjustedWaypoints[adjustedWaypoints.length - 1] = optimalPoints.target;
    }

    const style = {
        stroke: attrs.color || '#000000',
        strokeWidth: attrs.strokeWidth || 1,
        fill: 'none',
    };

    // Erstellen der Basislinie mit angepassten Wegpunkten
    const line = createLine(adjustedWaypoints, style);

    // Hinzufügen von Klassen basierend auf dem Verbindungstyp
    svgClasses(line).add('erm-connection');
    svgClasses(line).add(
        `erm-${lowerCaseTypeWithoutNamespace(connection.type)}`,
    );

    svgAppend(visuals, line);

    return line;
}
