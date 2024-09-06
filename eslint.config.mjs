import js from '@eslint/js';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';

export default [
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    plugins: ['@babel/plugin-syntax-import-attributes'],
                },
            },
            globals: {
                ...globals.browser,
            },
        },
    },
    js.configs.recommended,
    {
        ignores: ['**/dist/**'],
    },
    {
        files: ['**/karma.conf.js', '**/webpack.config.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ['**/test/**'],
        languageOptions: {
            globals: {
                ...globals.mocha,
                expect: 'readonly',
                sinon: 'readonly',
            },
        },
    },
];
