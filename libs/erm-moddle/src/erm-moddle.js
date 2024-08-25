import { Moddle } from 'moddle';

/**
 * A sub class of {@link Moddle} supporting the import and export of @newtool/erm-js JSON files.
 *
 * @class ErmModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options that can be passed in
 */
export default function ErmModdle(packages, options) {
    Moddle.call(this, packages, options);
}

ErmModdle.prototype = Object.create(Moddle.prototype);
