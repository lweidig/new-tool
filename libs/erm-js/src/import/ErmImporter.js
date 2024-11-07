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
    let elementRegistry;
    let warnings = [];

    const render = (ermRoot) => {
        const elementFactory = importer._elementFactory;
        elementRegistry = importer._elementRegistry;
        const parentElement = canvas._container || canvas._svg;
        const middleX = parentElement.clientWidth / 2;
        const middleY = parentElement.clientHeight / 2;

        const radius = Math.min(middleX, middleY) * 0.8;
        const shapes = ermRoot.cells.filter(
            (cell) =>
                cell.$instanceOf('erm:ErmElement') ||
                cell.$instanceOf('erm:ErmMetaElement'),
        );

        if (shapes.length === 0) {
            warnings.push(
                'no cells defined inside provided erm:Root - id: ' + ermRoot.id,
            );
            return;
        }

        const connections = ermRoot.cells.filter((cell) =>
            cell.$instanceOf('erm:ErmMetaLink'),
        );

        shapes.forEach((shape, index) => {
            const angle = (index / shapes.length) * 2 * Math.PI;
            const x = middleX + radius * Math.cos(angle) - 50;
            const y = middleY + radius * Math.sin(angle) - 40;

            const newShape = elementFactory.createShape({
                id: shape.id,
                type: shape.$type,
                businessObject: shape,
                x: x,
                y: y,
                width: 100,
                height: 80,
                name: shape.name || shape.$type,
            });
            eventBus.fire('ermElement.added', { element: newShape });
            canvas.addShape(newShape);
        });
        connections.forEach((connection) => {
            const sourceShape = elementRegistry.get(connection.sourceRef);
            const targetShape = elementRegistry.get(connection.targetRef);

            if (sourceShape && targetShape) {
                const newConnection = elementFactory.createConnection({
                    id: connection.id,
                    type: connection.$type,
                    businessObject: connection,
                    name:
                        connection.name ||
                        `${sourceShape.name} -> ${targetShape.name}`,
                    source: sourceShape,
                    target: targetShape,
                    waypoints: [
                        {
                            x: sourceShape.x + sourceShape.width / 2,
                            y: sourceShape.y + sourceShape.height / 2,
                        },
                        {
                            x: targetShape.x + targetShape.width / 2,
                            y: targetShape.y + targetShape.height / 2,
                        },
                    ],
                });
                eventBus.fire('ermElement.added', {
                    element: newConnection,
                });
                canvas.addConnection(newConnection);
            } else {
                const missingElement = !sourceShape ? 'source' : 'target';
                warnings.push(
                    'Could not add Connection: '
                        .concat(missingElement)
                        .concat(' element not found - id: ')
                        .concat(connection[missingElement + 'Ref']),
                );
            }
        });
    };

    try {
        importer = targetDiagram.get('ermImporter');
        eventBus = targetDiagram.get('eventBus');
        canvas = targetDiagram.get('canvas');
        eventBus.fire('import.render.start', { definitions: ermRoot });
        render(ermRoot);
        eventBus.fire('import.render.complete', { warnings: warnings });
        return Promise.resolve({ warnings: warnings });
    } catch (e) {
        e.warnings = warnings;
        return Promise.reject(e);
    }
}
