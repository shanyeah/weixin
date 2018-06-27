const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(webpackConfig, env) {


    // 对roadhog默认配置进行操作，比如：
    if (env === 'production') {
        // 上线环境使用分包打包方式  
        webpackConfig.output.chunkFilename = '[name].[chunkhash].js'
        webpackConfig.entry = {
            index: './src/index.js'
        };

        webpack.output = {jsonpFunction: 'webpackJsonp'};
        webpackConfig.module.rules.map((item) => {
            if (String(item.test) === '/\\.less$/' || String(item.test) === '/\\.css/') {
                item.use.filter(iitem => iitem.loader === 'css')[0].options.localIdentName = '[hash:base64:5]'
            }
            return item
        });
        webpackConfig.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
            })
        );

        webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }));
    } 

    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: `${__dirname}/src/index.ejs`,
        filename: 'index.html',
        minify: {
            collapseWhitespace: true,
        },
        hash: true,
        headScripts: null,
        dev: process.env.dev
    }));
    
    return webpackConfig
}