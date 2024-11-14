import Viewer from '@new-tool/erm-js';

let ermJs;

function createNewComponent(type) {
    switch (type) {
        case 'viewer':
            ermJs = new Viewer({
                container: '#erm-js-container',
            });
            break;
        case 'stepByStepViewer':
        case 'editor':
            alert(`please implement ${type}`);
            break;
        default:
            throw new Error(`Unknown component type: ${type}`);
    }
}

async function loadAndRenderDiagram(jsonFileName, componentType) {
    try {
        const response = await fetch(`resources/${jsonFileName}`);
        const jsonString = await response.text();

        if (ermJs) ermJs.destroy();
        createNewComponent(componentType);
        const result = await ermJs.importJson(jsonString);
        console.log('success !', result.warnings);
        ermJs.get('canvas').zoom('fit-viewport');
    } catch (err) {
        console.log('something went wrong:', err.warnings, err.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const componentSelect = document.getElementById('component-select');
    const jsonSelect = document.getElementById('json-select');

    componentSelect.addEventListener('change', (event) => {
        loadAndRenderDiagram(jsonSelect.value, event.target.value);
    });

    jsonSelect.addEventListener('change', (event) => {
        loadAndRenderDiagram(event.target.value, componentSelect.value);
    });

    if (jsonSelect.options.length > 0) {
        loadAndRenderDiagram(
            jsonSelect.options[0].value,
            componentSelect.options[0].value,
        );
    }
});

const exportJsonButton = document.getElementById('json-export-button');
exportJsonButton.addEventListener('click', async () => {
    try {
        const jsonData = await ermJs.saveJson();
        const blob = new Blob([jsonData], {
            type: 'application/json',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const fileName = 'diagram-export.json';

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('export successful!');
    } catch (err) {
        console.error('error while exporting:', err);
    }
});
