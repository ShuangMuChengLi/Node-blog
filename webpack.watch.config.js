const path = require("path");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.config.js");
const BUILD_PATH = path.resolve(__dirname, "dist");
const ROOT_PATH = path.resolve(__dirname, "public");
const CSS_PATH = path.resolve(ROOT_PATH, "css");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLESS = new ExtractTextPlugin("stylesheets/[name].less.css");
const extractCSS = new ExtractTextPlugin("stylesheets/[name].css");
module.exports = webpackMerge(commonConfig, {
    devtool: "source-map",
    module: {
        rules: [
            // {
            //     test: /\.(js|vue)$/,
            //     loader: "eslint-loader",
            //     enforce: "pre",
            //     include: [ROOT_PATH],
            //     options: {
            //         formatter: require("eslint-friendly-formatter")
            //     }
            // },
            {
                test: /\.css$/,
                use: extractCSS.extract(["css-loader", "postcss-loader"])
            },
            {
                test: /\.less$/,
                use: extractLESS.extract(['css-loader','postcss-loader', 'less-loader']),
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
        extractCSS,
        extractLESS,
        // new webpack.NoErrorsPlugin()
    ]
});
