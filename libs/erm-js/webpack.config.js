const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: {
            name: '@new-tool/erm-js',
            type: 'umd',
        },
        globalObject: 'this',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        rootMode: 'upward',
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false,
                            modules: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'erm-js.css',
        }),
    ],
    resolve: {
        alias: {
            '@new-tool/erm-moddle/lib': path.resolve(
                __dirname,
                '../erm-moddle/dist/index.js',
            ),
        },
    },
    mode: 'production',
    optimization: {
        usedExports: true,
    },
};
