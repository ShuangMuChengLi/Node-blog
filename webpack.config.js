const path = require("path");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ROOT_PATH = path.resolve(__dirname, "public");
const TEM_PATH = path.resolve(ROOT_PATH, "html");
const APP_PATH = path.resolve(ROOT_PATH, "js");
module.exports = {
    entry: {
        main: [ROOT_PATH + "/main.js"],
        login: [ROOT_PATH + "/login.js"],
        vendor: [
            "vue/dist/vue.common.js",
            "vue-resource",
            "moment",
            "lodash"
        ]
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.common.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.vue/,
                use: ["vue-loader"]
            },
            {
                test: /\.(js|jsx)$/,
                enforce: "pre",
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.(doc)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor",  "manifest"],
            minChunks: Infinity
        }),
        new HtmlwebpackPlugin({
            template: path.resolve(TEM_PATH, "cms.html"),
            filename: "cms.html",
            chunks: ["main", "vendor", "manifest"],
            inject: "body"
        }),
        new HtmlwebpackPlugin({
            template: path.resolve(TEM_PATH, "cms.html"),
            filename: "login.html",
            chunks: ["login", "vendor", "manifest"],
            inject: "body"
        })
    ]
};
