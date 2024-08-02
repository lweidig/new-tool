import translate from 'diagram-js/lib/i18n/translate';

import ErmImporter from './ErmImporter';

export default {
    __depends__: [translate],
    ermImporter: ['type', ErmImporter],
};
