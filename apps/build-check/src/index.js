// global Editor
import './index.css';
import '@new-tool/erm-js/styles';
import ErmViewer from '@new-tool/erm-js/lib';
import carRentalJson from '../resources/car-rental.json';

const viewer = new ErmViewer({
    container: document.querySelector('#viewer-container'),
});

viewer
    .importJson(carRentalJson)
    .then(function (result) {
        const { warnings } = result;

        console.log('success !', warnings);

        viewer.get('canvas').zoom('fit-viewport');
    })
    .catch(function (err) {
        const { warnings, message } = err;

        console.log('something went wrong:', warnings, message);
    });
