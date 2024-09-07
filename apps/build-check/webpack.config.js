const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

const resourcesPath = path.resolve(__dirname, 'resources');
const jsonFiles = fs
    .readdirSync(resourcesPath)
    .filter((file) => file.endsWith('.json'));

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
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
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            jsonFiles: jsonFiles,
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'resources', to: 'resources' },
                {
                    from: '../../libs/erm-js/dist/erm-js.css',
                    to: 'styles/erm-js.css',
                },
            ],
        }),
    ],
    resolve: {
        alias: {
            '@new-tool/erm-js/lib': path.resolve(
                __dirname,
                '../../libs/erm-js/dist/index.js',
            ),
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 8080,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    mode: 'development',
};
