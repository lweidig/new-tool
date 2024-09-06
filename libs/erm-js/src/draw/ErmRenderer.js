import { is } from '../shared/ModelUtil';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import inherits from 'inherits-browser';

/**
 * Renderer for ERM elements
 */
export default function ErmRenderer(
    config,
    eventBus,
    styles,
    pathMap,
    canvas,
    textRenderer,
    priority,
) {
    BaseRenderer.call(this, eventBus, priority);
    const defaultFillColor = config?.defaultFillColor;
    const defaultStrokeColor = config?.defaultStrokeColor;
    const defaultLabelColor = config?.defaultLabelColor;

    console.log('defaultFillColor', defaultFillColor);
    console.log('defaultStrokeColor', defaultStrokeColor);
    console.log('defaultLabelColor', defaultLabelColor);
    console.log('styles', styles);
    console.log('pathMap', pathMap);
    console.log('canvas', canvas);
    console.log('textRenderer', textRenderer);
}

inherits(ErmRenderer, BaseRenderer);

ErmRenderer.$inject = [
    'config.ermRenderer',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer',
];

/**
 * Check if the provided element can be rendered by this renderer.
 */
ErmRenderer.prototype.canRender = function (element) {
    return is(element, 'erm:BaseElement');
};

/**
 * Draw the provided shape into the provided parentGfx.
 */
ErmRenderer.prototype.drawShape = function (parentGfx, shape, attrs = {}) {
    var { type } = shape;

    var handler = this._renderer(type);

    return handler(parentGfx, shape, attrs);
};

/**
 * Draw the provided connection into the provided parentGfx.
 */
ErmRenderer.prototype.drawConnection = function (
    parentGfx,
    connection,
    attrs = {},
) {
    var { type } = connection;

    var handler = this._renderer(type);

    return handler(parentGfx, connection, attrs);
};

/**
 * Get the path that needs to be drawn depending on the provided shape
 */
ErmRenderer.prototype.getShapePath = function (shape) {
    console.log('shape', shape);
    // TODO: implement different paths for different shapes
};
