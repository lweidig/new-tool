import ErmRenderer from './ErmRenderer.js';
import TextRenderer from './TextRenderer.js';
import PathMap from './PathMap.js';

export default {
    __init__: ['ermRenderer'],
    ermRenderer: ['type', ErmRenderer],
    textRenderer: ['type', TextRenderer],
    pathMap: ['type', PathMap],
};
