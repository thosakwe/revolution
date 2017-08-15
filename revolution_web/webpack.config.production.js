const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index.js',
    ],

    output: {
        filename: 'bundle.js',
        path: __dirname,
        publicPath: '/'
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false
        })
    ]
};