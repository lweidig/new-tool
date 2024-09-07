import { Moddle } from 'moddle';

/**
 * A sub class of {@link Moddle} supporting the import and export of @newtool/erm-js JSON strings.
 *
 * @class ErmModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages - Packages to use for instantiating the model
 * @param {Object} [options] - Additional options that can be passed in
 */
export default function ErmModdle(packages, options) {
    Moddle.call(this, packages, options);
}

// Set up prototype chain
ErmModdle.prototype = Object.create(Moddle.prototype);

/**
 * Parse a JSON string and create a model instance.
 *
 * @param {string} jsonString - The JSON string to parse
 * @returns {Promise<Object>} A promise that resolves with the model instance
 * or rejects with an error if the JSON is invalid
 */
ErmModdle.prototype.fromJson = function (jsonString) {
    try {
        const json = JSON.parse(jsonString);
        if (json.$type !== 'erm:Root') {
            throw new Error(
                'Could not find root element. Please provide a valid ERM JSON string.',
            );
        }
        const modelInstance = this.create('erm:Root', json);
        if (json.cells && Array.isArray(json.cells)) {
            modelInstance.cells = mapNotNull(json.cells, (c) => {
                try {
                    return this.create(c.$type, c);
                } catch (_error) {
                    return null;
                }
            });
        } else {
            modelInstance.cells = [];
        }
        return Promise.resolve(modelInstance);
    } catch (error) {
        return Promise.reject(error);
    }
};

function mapNotNull(array, transform) {
    return array.map(transform).filter((item) => item != null);
}
