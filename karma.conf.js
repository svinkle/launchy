module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: [
            'jasmine', 'fixture'
        ],
        plugins: [
            'karma-coverage',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-jasmine-html-reporter',
            'karma-webpack',
            'karma-fixture',
            'karma-html2js-preprocessor'
        ],
        files: [
            {
                pattern: 'brochure/js/launchy.js',
                watched: false,
                served: true,
                included: true,
                nocache: false
            }, {
                pattern: 'brochure/index.html',
                watched: false,
                served: true,
                included: true,
                nocache: false
            }, {
                pattern: 'test/index.js',
                watched: true,
                served: true,
                included: true,
                nocache: false
            }
        ],
        exclude: [],
        preprocessors: {
            'test/index.js': ['webpack'],
            'brochure/js/launchy.js': ['coverage'],
            'brochure/index.html': ['html2js']
        },
        webpackMiddleware: {
            noInfo: true,
            stats: 'errors-only'
        },
        reporters: [
            'progress', 'kjhtml', 'coverage'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        failOnEmptyTestSuite: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity,
        coverageReporter: {
            reporters: [
                {
                    type: 'lcovonly',
                    subdir: '.'
                },
                {
                    type: 'json',
                    subdir: '.'
                }
            ]
        },
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
