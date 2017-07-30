module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine', 'karma-chrome-launcher', 'karma-jasmine-html-reporter', 'karma-webpack'
        ],
        files: [
            {
                pattern: './src/launchy.js',
                watched: true,
                served: true,
                included: true,
                nocache: false
            }, {
                pattern: './test/index.js',
                watched: true,
                served: true,
                included: true,
                nocache: false
            }
        ],
        exclude: [],
        preprocessors: {
            './test/index.js': ['webpack']
        },
        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        },
        reporters: [
            'progress', 'kjhtml'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        failOnEmptyTestSuite: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity,
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        },
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
                flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222']
            }
        }
    });
};
