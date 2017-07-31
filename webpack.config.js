const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = [{
    entry: './src/launchy.js',
    output: {
        filename: './dist/launchy.js',
        library: 'Launchy'
    },
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
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildExit: ['npm run copy-to-brochure', 'npm run reload']
        })
    ]
}];
