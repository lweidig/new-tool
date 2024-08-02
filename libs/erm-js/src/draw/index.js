import ErmRenderer from './ErmRenderer';
import TextRenderer from './TextRenderer';

import PathMap from './PathMap';

export default {
    __init__: ['ermRenderer'],
    ermRenderer: ['type', ErmRenderer],
    textRenderer: ['type', TextRenderer],
    pathMap: ['type', PathMap],
};
