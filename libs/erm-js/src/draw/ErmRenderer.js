import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { componentsToPath } from 'diagram-js/lib/util/RenderUtil';
import inherits from 'inherits-browser';
import { append as svgAppend } from 'tiny-svg';
import { is } from '../shared/ModelUtil';
import { renderAssociation } from './connections/association';
import { renderNoteLink } from './connections/notelink';
import { renderSubsetLink } from './connections/subsetlink';
import { renderComment } from './shapes/comment';
import { renderConstraint } from './shapes/constraint';
import { renderEntity } from './shapes/entity';
import { renderGeneralization } from './shapes/generalization';
import { renderRelationship } from './shapes/relationship';

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
    this.CONNECTION_STYLE = this._styles.style(['no-fill'], {
        strokeWidth: 5,
        stroke: 'fuchsia',
    });
    this.SHAPE_STYLE = this._styles.style({
        fill: 'white',
        stroke: 'fuchsia',
        strokeWidth: 2,
    });
    this.FRAME_STYLE = this._styles.style(['no-fill'], {
        stroke: 'fuchsia',
        strokeDasharray: 4,
        strokeWidth: 2,
    });
}

inherits(ErmRenderer, BaseRenderer);

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
ErmRenderer.prototype.drawShape = function (visuals, element, attrs) {
    var renderedShape;
    switch (element.type) {
        case 'erm:Entity':
            renderedShape = renderEntity(element, this._textRenderer, attrs);
            break;
        case 'erm:Relationship':
            renderedShape = renderRelationship(
                element,
                this._textRenderer,
                attrs,
            );
            break;
        case 'erm:Generalization':
        case 'erm:DisjunctGeneralization':
        case 'erm:OverlappingGeneralization':
            renderedShape = renderGeneralization(element, attrs);
            break;
        case 'erm:Comment':
            renderedShape = renderComment(element, attrs);
            break;
        case 'erm:Constraint':
            renderedShape = renderConstraint(element, attrs);
            break;
        default:
            console.warn(
                `drawShape for element ${element.type} is not supported`,
                element,
            );
            break;
    }
    if (renderedShape) {
        svgAppend(visuals, renderedShape);
    }
    return renderedShape;
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
ErmRenderer.prototype.drawConnection = function (visuals, connection, attrs) {
    var renderedConnection;
    switch (connection.type) {
        case 'erm:Association':
            renderedConnection = renderAssociation(connection, attrs);
            break;
        case 'erm:NoteLink':
            renderedConnection = renderNoteLink(connection, attrs);
            break;
        case 'erm:SubsetLink':
            renderedConnection = renderSubsetLink(connection, attrs);
            break;
        default:
            console.warn(
                `drawConnection for element ${connection.type} is not supported`,
                connection,
            );
            break;
    }
    if (renderedConnection) {
        svgAppend(visuals, renderedConnection);
    }
    return renderedConnection;
};

ErmRenderer.prototype.getShapePath = function getShapePath(shape) {
    console.warn('getShapePath called for', shape);
    const width = shape.width;
    const shapePath = [
        ['M', shape.x, shape.y],
        ['l', width, 0],
        ['l', 0, shape.height],
        ['l', -width, 0],
        ['z'],
    ];
    return componentsToPath(shapePath);
};

ErmRenderer.prototype.getConnectionPath = function getConnectionPath(
    connection,
) {
    console.warn('getConnectionPath called for', connection);
    const waypoints = connection.waypoints;
    const connectionPath = [];
    let point;
    for (let idx = 0; (point = waypoints[idx]); idx++) {
        point = point.original || point;
        connectionPath.push([idx === 0 ? 'M' : 'L', point.x, point.y]);
    }
    return componentsToPath(connectionPath);
};

ErmRenderer.$inject = [
    'config.ermRenderer',
    'eventBus',
    'styles',
    'canvas',
    'textRenderer',
];
