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

/**
 * Export the current state of the provided Moddle instance to a JSON string.
 *
 * @param {Object} modelInstance - The model instance to export
 * @returns {Promise<String>} A promise that resolves with the provided
 * instance's JSON representation or rejects with an TypeError in case
 * translation to JSON fails unexpectedly.
 */
ErmModdle.prototype.toJson = function (modelInstance) {
    try {
        const modelInstanceWithEnumerableRefs = getCloneWithEnumerableProps(
            modelInstance,
            ['sourceRef', 'targetRef'],
        );
        const json = JSON.stringify(modelInstanceWithEnumerableRefs);
        return Promise.resolve(json);
    } catch (error) {
        return Promise.reject(error);
    }
};

function mapNotNull(array, transform) {
    return array.map(transform).filter((item) => item != null);
}

function getCloneWithEnumerableProps(obj, propertiesToMakeEnumerable) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            getCloneWithEnumerableProps(item, propertiesToMakeEnumerable),
        );
    }

    const allProperties = [
        ...Object.getOwnPropertyNames(obj),
        ...Object.getOwnPropertySymbols(obj),
    ];

    const clone = Object.create(Object.getPrototypeOf(obj));

    allProperties.forEach((prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

        if (propertiesToMakeEnumerable.includes(prop.toString())) {
            descriptor.enumerable = true;
        }

        if (descriptor.value && typeof descriptor.value === 'object') {
            descriptor.value = getCloneWithEnumerableProps(
                descriptor.value,
                propertiesToMakeEnumerable,
            );
        }

        Object.defineProperty(clone, prop, descriptor);
    });

    return clone;
}
