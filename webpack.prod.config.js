const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');
const BUILD_PATH = path.resolve(__dirname, 'dist');
const ROOT_PATH = path.resolve(__dirname, 'public');
const CSS_PATH = path.resolve(ROOT_PATH, 'css');
const postcssConfig = require('./postcss.config');

const BabiliPlugin = require("babili-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('stylesheets/[contenthash].[name].less.css');
const extractCSS = new ExtractTextPlugin('stylesheets/[contenthash].[name].css');
module.exports = webpackMerge(commonConfig, {
    // entry: {
    //   vendor:['vue/dist/vue.common.js','vue-resource','vue-router']
    // },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader', 'postcss-loader'])
            },
            {
                test: /\.less$/,
                use: extractLESS.extract(['css-loader', 'postcss-loader', 'less-loader']),
                include: CSS_PATH
            }
        ]
    },
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: BUILD_PATH,
        publicPath: "/",
        filename: "js/[chunkhash].[name].bundle.js",
        chunkFilename: "js/[chunkhash].[name].chunk.js"
    },
    plugins: [

        new BabiliPlugin(),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'process.env': {
                //注意一个单引号一个双引号…… 这里是要将 "production" 替换到文件里面
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        extractCSS,
        extractLESS
    ]
})
