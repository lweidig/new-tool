import { assign, isNumber, omit } from 'min-dash';

import {
    domify,
    assignStyle,
    query as domQuery,
    remove as domRemove,
} from 'min-dom';

import Diagram from 'diagram-js';

import ErmModdle from '@new-tool/erm-moddle';

import inherits from 'inherits-browser';

import { importErmDiagram } from './import/ErmImporter.js';

const BASE_OPTIONS = {
    width: '100%',
    height: '100%',
    position: 'relative',
};

const enrichErrorWithWarnings = (err, warningsAry) => {
    err.warnings = warningsAry;
    return err;
};

/**
 * BaseViewer - Core component for ERM diagram viewing and editing
 *
 * This class provides fundamental functionality for importing, rendering
 * and exporting Entity-Relationship Model (ERM) diagrams.
 */
export default function BaseViewer(options) {
    options = assign({}, BASE_OPTIONS, options);
    this._moddle = this._createModdle(options);
    this._container = this._createContainer(options);
    this._init(this._container, this._moddle, options);
}

inherits(BaseViewer, Diagram);

/**
 * Import a JSON representation of an ERM diagram
 *
 * This method handles the entire import process, including parsing,
 * error handling, and event emission.
 */
BaseViewer.prototype.importJson = async function importJson(jsonString) {
    let aggregatedWarnings = [];
    try {
        this._emit('import.parse.start', { json: jsonString });

        let modelInstance;
        try {
            modelInstance = await this._moddle.fromJson(jsonString);
        } catch (error) {
            this._emit('import.parse.complete', {
                error,
            });

            throw error;
        }

        const importResult =
            await this.importErDiagramSpecification(modelInstance);

        aggregatedWarnings = aggregatedWarnings.concat(importResult.warnings);

        this._emit('import.done', {
            error: null,
            warnings: aggregatedWarnings,
        });

        return { warnings: aggregatedWarnings };
    } catch (err) {
        let error = err;
        aggregatedWarnings = aggregatedWarnings.concat(error.warnings || []);
        enrichErrorWithWarnings(error, aggregatedWarnings);

        this._emit('import.done', { error, warnings: error.warnings });

        throw error;
    }
};

/**
 * Import parsed structure and render the structure as an ERM diagram.
 * During import of the parsed structure the following events are fired:
 *
 *   * import.render.start (graphical import start)
 *   * import.render.complete (graphical import finished)
 *
 * @return A promise containing warnings that might have been produced during the
 * import of the parsed structure.
 */
BaseViewer.prototype.importErDiagramSpecification =
    async function importErDiagramSpecification(erDiagramSpecification) {
        this._setErDiagramSpecification(erDiagramSpecification);
        const result = await this.open();

        return { warnings: result.warnings };
    };

/**
 * Open a specific diagram from an existing erDiagramSpecification
 */
BaseViewer.prototype.open = async function open() {
    const erDiagramSpecification = this.getErDiagramSpecification();

    if (!erDiagramSpecification) {
        const error = new Error('no JSON imported'); // why are we here???
        enrichErrorWithWarnings(error, []);

        throw error;
    }

    try {
        this.clear();
    } catch (error) {
        enrichErrorWithWarnings(error, []);

        throw error;
    }

    // perform graphical import via ErmImporter
    const { warnings } = await importErmDiagram(this, erDiagramSpecification);

    return { warnings };
};

/**
 * Export the current ERM diagram as a JSON document
 *
 * This method serializes the current diagram state to JSON format,
 * emitting events at various stages of the process.
 *   * saveJson.start (before serialization)
 *   * saveJson.serialized (after json generation)
 *   * saveJson.done (everything done)
 */
BaseViewer.prototype.saveJson = async function saveJson(options) {
    options = options || {};

    let definitions = this._definitions,
        error,
        json;

    try {
        if (!definitions) {
            throw new Error('no definitions loaded');
        }

        definitions =
            this._emit('saveJson.start', {
                definitions,
            }) || definitions;

        const result = await this._moddle.toJson(definitions, options);
        json = result.json;

        json =
            this._emit('saveJson.serialized', {
                json,
            }) || json;
    } catch (err) {
        error = err;
    }

    const result = error ? { error } : { json };

    this._emit('saveJson.done', result);

    if (error) {
        throw error;
    }

    return result;
};

/**
 * Export the current ERM diagram as an SVG image
 *
 * This method generates an SVG representation of the current diagram,
 * including necessary metadata and styling.
 * The following events are thrown:
 *   * saveSVG.start (before serialization)
 *   * saveSVG.done (everything done)
 */
BaseViewer.prototype.saveSVG = async function saveSVG() {
    this._emit('saveSVG.start');

    let svg, err;

    try {
        // TODO implement SVG saving
    } catch (e) {
        err = e;
    }

    this._emit('saveSVG.done', {
        error: err,
        svg: svg,
    });

    if (err) {
        throw err;
    }

    return { svg };
};

/**
 * Get the currently imported erDiagramSpecification of the viewer
 */
BaseViewer.prototype.getErDiagramSpecification = function () {
    return this._erDiagramSpecification;
};

/**
 * Set the currently imported erDiagramSpecification of the viewer
 */
BaseViewer.prototype._setErDiagramSpecification = function (
    erDiagramSpecification,
) {
    this._erDiagramSpecification = erDiagramSpecification;
};

/**
 * Get the modules to be instantiated with the viewer
 */
BaseViewer.prototype.getModules = function () {
    return this._modules;
};

/**
 * Clear all drawn elements from the viewer
 *
 * This method removes all current diagram elements, allowing
 * the viewer to be reused for a new diagram.
 */
BaseViewer.prototype.clear = function () {
    if (!this.getErDiagramSpecification()) {
        return;
    }
    Diagram.prototype.clear.call(this);
};

/**
/**
 * Destroy the viewer instance and clean up resources
 *
 * This method removes the viewer from the DOM and performs
 * necessary cleanup operations.
 */
BaseViewer.prototype.destroy = function () {
    Diagram.prototype.destroy.call(this);
    domRemove(this._container);
};

/**
 * Register an event listener
 *
 * This method allows registration of callbacks for specific events,
 * with optional priority and context.
 */
BaseViewer.prototype.on = function (events, priority, callback, that) {
    return this.get('eventBus').on(events, priority, callback, that);
};

/**
 * Remove an event listener.
 */
BaseViewer.prototype.off = function (events, callback) {
    this.get('eventBus').off(events, callback);
};

/**
 * Attach the viewer to an HTML element
 *
 * This method handles the process of adding the viewer's container
 * to a specified parent node in the DOM.
 */
BaseViewer.prototype.attachTo = function (parentNode) {
    if (!parentNode) {
        throw new Error('parentNode required');
    }

    this.detach();

    if (parentNode.get) {
        parentNode = parentNode.get(0);
    }

    if (typeof parentNode === 'string') {
        parentNode = domQuery(parentNode);
    }

    parentNode.appendChild(this._container);

    this._emit('attach', {});

    this.get('canvas').resized();
};

/**
 * Detach the viewer from its current parent node
 */
BaseViewer.prototype.detach = function () {
    const container = this._container;
    const parentNode = container.parentNode;

    if (!parentNode) {
        return;
    }

    this._emit('detach', {});

    parentNode.removeChild(container);
};

/**
 * Initialize the viewer
 *
 * This private method sets up the viewer with necessary modules
 * and options, creating the core diagram structure.
 */
BaseViewer.prototype._init = function (container, moddle, options) {
    const baseModules = options.modules || this.getModules(options);
    const additionalModules = options.additionalModules || [];
    const staticModules = [
        {
            ermjs: ['value', this],
            moddle: ['value', moddle],
        },
    ];

    const diagramModules = [].concat(
        staticModules,
        baseModules,
        additionalModules,
    );

    const diagramOptions = assign(omit(options, ['additionalModules']), {
        canvas: assign({}, options.canvas, { container: container }),
        modules: diagramModules,
    });

    Diagram.call(this, diagramOptions);

    if (options && options.container) {
        this.attachTo(options.container);
    }
};

/**
 * Emit an event on the underlying EventBus
 */
BaseViewer.prototype._emit = function (type, event) {
    return this.get('eventBus').fire(type, event);
};

/**
 * Create the container element for the viewer
 */
BaseViewer.prototype._createContainer = function (options) {
    const container = domify('<div class="djs-parent"></div>');
    const appendPxIfNumeric = (value) => value + (isNumber(value) ? 'px' : '');

    assignStyle(container, {
        width: appendPxIfNumeric(options.width),
        height: appendPxIfNumeric(options.height),
        position: options.position,
    });

    return container;
};

/**
 * Create a Moddle instance that is used for interpreting Json Input
 */
BaseViewer.prototype._createModdle = function (options) {
    const moddleOptions = assign(
        {},
        this._moddleExtensions,
        options.moddleExtensions,
    );

    return new ErmModdle(moddleOptions);
};

BaseViewer.prototype._modules = [];
