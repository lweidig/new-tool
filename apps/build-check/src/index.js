import Viewer from '@new-tool/erm-js/lib';

let viewer;

async function loadAndRenderDiagram(jsonFileName) {
    try {
        const response = await fetch(`resources/${jsonFileName}`);
        const jsonString = await response.text();

        if (viewer) {
            viewer.clear();
        } else {
            viewer = new Viewer({
                container: '#viewer-container',
            });
        }

        const result = await viewer.importJson(jsonString);
        console.log('success !', result.warnings);
        viewer.get('canvas').zoom('fit-viewport');
    } catch (err) {
        console.log('something went wrong:', err.warnings, err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selectElement = document.getElementById('json-select');

    selectElement.addEventListener('change', (event) => {
        loadAndRenderDiagram(event.target.value);
    });

    if (selectElement.options.length > 0) {
        loadAndRenderDiagram(selectElement.options[0].value);
    }
});
