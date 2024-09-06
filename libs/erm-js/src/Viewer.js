import inherits from 'inherits-browser';

import CoreModule from './core/index.js';

import BaseViewer from './BaseViewer.js';

export default function Viewer(options) {
    BaseViewer.call(this, options);
}

inherits(Viewer, BaseViewer);

Viewer.prototype._modules = [CoreModule];

Viewer.prototype._moddleExtensions = {};
