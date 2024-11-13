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

const exportJsonButton = document.getElementById('json-export-button');
exportJsonButton.addEventListener('click', async () => {
    try {
        // Exportiere das Diagramm als JSON
        const jsonData = await viewer.saveJson();

        // Erstelle einen Blob aus den JSON Daten
        const blob = new Blob([jsonData], {
            type: 'application/json',
        });

        // Erstelle einen Download Link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Setze den Dateinamen
        const fileName = 'diagram-export.json';
        a.href = url;
        a.download = fileName;

        // Füge den Link zum Dokument hinzu und klicke ihn programmatisch
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('Export erfolgreich!');
    } catch (err) {
        console.error('Fehler beim Export:', err);
    }
});
