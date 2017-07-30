const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {

    // Demo
    demo: {
        entry: './src/launchy.js',
        output: './dist/launchy.js',
        plugins: [
            new WebpackShellPlugin({
                onBuildExit: ['npm run copy-to-brochure', 'npm run reload']
            })
        ]
    },

    // `npm` package
    npmPackage: {
        entry: './src/launchy.js',
        output: './dist/npm/index.js'
    },

    // Webpack modules config
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
};

module.exports = [

    // Demo
    {
        entry: config.demo.entry,
        output: {
            filename: config.demo.output,
            library: 'Launchy'
        },
        module: config.module,
        plugins: config.demo.plugins
    },

    // `npm` package
    {
        entry: config.npmPackage.entry,
        output: {
            filename: config.npmPackage.output,
            libraryTarget: 'commonjs2'
        },
        module: config.module
    }
];
