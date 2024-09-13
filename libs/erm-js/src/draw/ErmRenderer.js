import { is } from '../shared/ModelUtil';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses,
} from 'tiny-svg';

import inherits from 'inherits-browser';

/**
 * Renderer for ERM elements
 */
export default function ErmRenderer(
    config,
    eventBus,
    styles,
    canvas,
    textRenderer,
) {
    BaseRenderer.call(this, eventBus);

    this._styles = styles;
    this._canvas = canvas;
    this._textRenderer = textRenderer;
}

inherits(ErmRenderer, BaseRenderer);

ErmRenderer.$inject = [
    'config.ermRenderer',
    'eventBus',
    'styles',
    'canvas',
    'textRenderer',
];

/**
 * Checks whether an element can be rendered.
 * @override BaseRenderer.canRender
 *
 * @param {Element} element The element to be rendered.
 *
 * @return {boolean} Whether the element can be rendered.
 */
ErmRenderer.prototype.canRender = function (element) {
    return is(element, 'erm:BaseElement');
};

/**
 * Draws an ERM shape.
 * @override BaseRenderer.drawShape
 *
 * @param {SVGElement} visuals The SVG element to draw the shape into.
 * @param {Shape} shape The shape to be drawn.
 *
 * @return {SVGElement} The SVG element of the shape drawn.
 */
ErmRenderer.prototype.drawShape = function (parentNode, element) {
    const visual = svgCreate('g');

    if (is(element, 'erm:Entity')) {
        const rect = createRect(element);

        svgAppend(visual, rect);
    } else if (is(element, 'erm:Relationship')) {
        const diamond = createDiamond(element);
        svgAppend(visual, diamond);
    }

    this._renderLabel(visual, element);

    svgAppend(parentNode, visual);

    return visual;
};

/**
 * Draws an ERM connection.
 * @override BaseRenderer.drawConnection
 *
 * @param {SVGElement} visuals The SVG element to draw the connection into.
 * @param {Connection} connection The connection to be drawn.
 *
 * @return {SVGElement} The SVG element of the connection drawn.
 */
ErmRenderer.prototype.drawConnection = function (
    parentGfx,
    connection,
    attrs = {},
) {
    const { waypoints } = connection;
    const source = connection.source;
    const target = connection.target;
    const optimalPoints = calculateOptimalConnectionPoints(source, target);
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

    // Erstellen der Basislinie mit angepassten Wegpunkten
    const line = createLine(adjustedWaypoints, style);

    // Hinzufügen von Klassen basierend auf dem Verbindungstyp
    svgClasses(line).add('erm-connection');
    svgClasses(line).add(
        `erm-${lowerCaseTypeWithoutNamespace(connection.type)}`,
    );

    // Spezielle Behandlung für verschiedene Verbindungstypen
    switch (connection.type) {
        case 'erm:Association':
            // Normale Linie für Assoziationen
            break;
        case 'erm:Generalization':
            // Pfeil am Ende für Generalisierung
            addArrowHead(line, adjustedWaypoints[adjustedWaypoints.length - 1]);
            break;
        case 'erm:NoteLink':
            // Gestrichelte Linie für Notiz-Verbindungen
            line.style.strokeDasharray = '5, 5';
            break;
        case 'erm:SubsetLink':
            // Gepunktete Linie für Subset-Verbindungen
            line.style.strokeDasharray = '1, 3';
            break;
        default:
            console.warn(`Unbekannter Verbindungstyp: ${connection.type}`);
    }

    svgAppend(parentGfx, line);

    return line;
};

ErmRenderer.prototype._renderLabel = function (
    parentGfx,
    labelRequestingElement,
) {
    const options = standardTextLayoutConfig(
        labelRequestingElement.width,
        labelRequestingElement.height,
    );

    const text = this._textRenderer.createText(
        labelRequestingElement?.name || '',
        options,
    );

    svgClasses(text).add('djs-label');

    svgAppend(parentGfx, text);

    // TODO: ensure rendering label text in the middle of the shape via post processing

    return text;
};

const createRect = (element) => {
    const rect = svgCreate('rect');
    svgAttr(rect, {
        x: 0,
        y: 0,
        width: element.width,
        height: element.height,
        rx: 10,
        ry: 10,
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    rect.setAttribute('fill', '#FFFFFF');
    return rect;
};

const createDiamond = (element) => {
    const diamond = svgCreate('path');
    svgAttr(diamond, {
        d: getDiamondPath(element),
        stroke: '#000000',
        strokeWidth: 2,
        fill: '#FFFFFF',
    });
    diamond.setAttribute('fill', '#FFFFFF');
    return diamond;
};

const getDiamondPath = (element) => {
    const { width, height } = element;
    const middleX = width / 2;
    const middleY = height / 2;
    return `M${middleX},0 L${width},${middleY} L${middleX},${height} L0,${middleY} Z`;
};

const standardTextLayoutConfig = (elementWidth, elementHeight) => {
    return {
        align: 'center-middle',
        box: {
            width: elementWidth,
            height: elementHeight,
        },
        fitBox: false,
        padding: {
            left: parseInt(elementWidth * 0.3),
        },
    };
};

const addArrowHead = (line, endPoint) => {
    const arrowHead = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
    );
    const arrowSize = 10;
    const arrowPath = ''.concat(
        'M',
        endPoint.x,
        ',',
        endPoint.y,
        'L',
        endPoint.x - arrowSize,
        ',',
        endPoint.y - arrowSize,
        'L',
        endPoint.x - arrowSize,
        ',',
        endPoint.y + arrowSize,
        'Z',
    );

    arrowHead.setAttribute('d', arrowPath);
    arrowHead.setAttribute('fill', line.style.stroke);

    line.parentNode.appendChild(arrowHead);
};

const calculateOptimalConnectionPoints = (sourceElement, targetElement) => {
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
};

const getConnectionPoint = (element, preferredConnectionPoint) => {
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
};

const lowerCaseTypeWithoutNamespace = (type) => {
    return type.substring(type.indexOf(':') + 1).toLowerCase();
};
