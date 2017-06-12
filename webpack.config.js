module.exports = {
    entry: "./index.js",
    output: {
        path: __dirname + '/build',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    // devtool: 'source-map',
    module: {
        loaders: [{
             test: /\.js$/,
             loader: 'babel-loader',
             query: {
                 presets: ['es2015']
             }
        }]
    }
};
