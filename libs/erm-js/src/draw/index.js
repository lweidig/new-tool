import ErmRenderer from './ErmRenderer.js';
import TextRenderer from './TextRenderer.js';

export default {
    __init__: ['ermRenderer'],
    ermRenderer: ['type', ErmRenderer],
    textRenderer: ['type', TextRenderer],
};
