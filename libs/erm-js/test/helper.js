import Viewer from '@new-tool/erm-js';

import TestContainer from 'mocha-test-container-support';
import { isFunction, forEach, merge } from 'min-dash';

let OPTIONS;
let ERM_JS_MAIN_MODULE;

export function bootstrapViewer(diagram, options, locals) {
    return getTestInstance(Viewer, diagram, options, locals);
}

export function inject(fn) {
    return function () {
        if (!ERM_JS_MAIN_MODULE) {
            throw new Error(
                'no bootstraped erm-js instance, ' +
                    'ensure you created it via #boostrap(Modeler|Viewer)',
            );
        }

        return ERM_JS_MAIN_MODULE.invoke(fn);
    };
}

export function getTestInstance(ErmJsMainModule, diagram, options, locals) {
    return function () {
        let testContainer;

        try {
            testContainer = TestContainer.get(this);
        } catch (_e) {
            testContainer = document.createElement('div');
            testContainer.classList.add('test-content-container');
            document.body.appendChild(testContainer);
        }

        let _options = options;
        let _locals = locals;

        if (_locals === undefined && isFunction(_options)) {
            _locals = _options;
            _options = null;
        }

        if (isFunction(_options)) {
            _options = _options();
        }

        if (isFunction(_locals)) {
            _locals = _locals();
        }

        _options = merge(
            {
                container: testContainer,
                canvas: {
                    deferUpdate: false,
                },
            },
            OPTIONS,
            _options,
        );

        if (_locals) {
            const mockModule = {};

            forEach(_locals, function (v, k) {
                mockModule[k] = ['value', v];
            });

            _options.modules = [].concat(_options.modules || [], [mockModule]);
        }

        if (_options.modules && !_options.modules.length) {
            _options.modules = undefined;
        }

        clearErmJsMainModule();

        const instance = new ErmJsMainModule(_options);

        setErmJsMainModule(instance);

        return instance
            .importJson(diagram)
            .then(function (result) {
                return { error: null, warnings: result.warnings };
            })
            .catch(function (err) {
                return { error: err, warnings: err.warnings };
            });
    };
}

export function getErmJsMainModule() {
    return ERM_JS_MAIN_MODULE;
}

export function clearErmJsMainModule() {
    if (ERM_JS_MAIN_MODULE) {
        ERM_JS_MAIN_MODULE.destroy();
        ERM_JS_MAIN_MODULE = null;
    }
}

export function setErmJsMainModule(instance) {
    ERM_JS_MAIN_MODULE = instance;
}
