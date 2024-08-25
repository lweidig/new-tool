import ErmModdle from './erm-moddle.js';

import ErmPackage from '../resources/meta-model/erm.json' with { type: 'json' };

const packages = {
    erm: ErmPackage,
};

export default function ConfiguredErmModdle(additionalPackages, options) {
    const pks = Object.assign({}, packages, additionalPackages);

    return new ErmModdle(pks, options);
}
