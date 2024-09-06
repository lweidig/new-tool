/**
 * An importer that adds ERM elements to the canvas
 */
export default function ErmImporter(
    eventBus,
    canvas,
    elementFactory,
    elementRegistry,
    textRenderer,
) {
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._elementFactory = elementFactory;
    this._elementRegistry = elementRegistry;
    this._textRenderer = textRenderer;
}

ErmImporter.$inject = [
    'eventBus',
    'canvas',
    'elementFactory',
    'elementRegistry',
    'textRenderer',
];

/**
 * Draws an ERM diagram into the target diagram based on the given moddle object
 *
 * @param {*} targetDiagram the target diagram to draw the ERM diagram into
 * @param {*} ermRoot the root element of the moddle object representing the ERM diagram
 * @returns Promise that resolves with the warnings that occurred during the import
 */
export function importErmDiagram(targetDiagram, ermRoot) {
    let importer;
    let eventBus;
    let canvas;
    let error;
    let warnings = [];

    const render = (ermRoot) => {
        console.log('ermRoot', ermRoot);
        // TODO: implement rendering
    };

    return new Promise((resolve, reject) => {
        try {
            importer = targetDiagram.get('ermImporter');
            eventBus = targetDiagram.get('eventBus');
            canvas = targetDiagram.get('canvas');

            console.log('importer', importer);
            console.log('canvas', canvas);

            eventBus.fire('import.render.start', { definitions: ermRoot });

            render(ermRoot);

            eventBus.fire('import.render.complete', {
                error: error,
                warnings: warnings,
            });

            return resolve({ warnings: warnings });
        } catch (e) {
            e.warnings = warnings;
            return reject(e);
        }
    });
}
