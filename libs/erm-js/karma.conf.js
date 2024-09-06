/* eslint-env node */
module.exports = function (config) {
    config.set({
        frameworks: ['mocha', 'webpack'],
        files: [{ pattern: 'test/**/*.js', type: 'module' }],
        preprocessors: {
            'test/**/*.js': ['webpack'],
        },
        webpack: {
            mode: 'development',
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
            resolve: {
                extensions: ['.js', '.css'],
            },
        },
        plugins: ['karma-webpack', 'karma-mocha', 'karma-chrome-launcher'],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        reporters: ['progress'],
    });
};
