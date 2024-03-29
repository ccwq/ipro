let path = require("path");
let MiniCssExtract = require('mini-css-extract-plugin');

const fs = require('fs')
const glob = require('glob')
const appDirectory = fs.realpathSync(process.cwd());
const webpack = require("webpack");


const SOURCE_DIR_NAME = "src";

const TARGET_DIR_NAME = "dist";


const {CleanWebpackPlugin} = require('clean-webpack-plugin');


// 获取文件公共方法
const getFiles = filesPath => {
    let files = glob.sync(filesPath)
    let obj = {}

    for (let i = 0; i < files.length; i++) {

        let relativePath = files[i]

        // 扩展名 eg: .js
        let extName = path.extname(relativePath)

        // 文件名 eg: index
        let baseName = path.basename(relativePath, extName)


        let entryName = relativePath.replace(SOURCE_DIR_NAME + "/", "").replace(extName, "");

        let filePath = path.resolve(appDirectory, relativePath);

        obj[entryName] = {
            path:filePath,
            filePath,
            relativePath,
            entryName,
            extName,
            baseName,
        }
    }

    return obj
}


const entry = Object.values(getFiles("src/**/*.?(js|ts)")).reduce((ret, el) => {
    console.log(el, el.filePath);
    ret[el.entryName] = el.filePath;
    return ret;
}, {});


module.exports = {
    devServer: {
        port: 3000,
        progress: true,
        contentBase: "./build",
        compress: true
    },
    // mode: "development",
    mode: "production",
    entry,
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new CleanWebpackPlugin(),

        // short-circuits all Vue.js warning code
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtract.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtract.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            },
            {
                // 匹配js文件，然后用下面所配置的工具对这些文件进行编译处理
                test: /\.js$/,
                use: {
                    // babel的核心模块
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            // 配置babel的预设，将ES语法转成ES5语法
                            '@babel/preset-env'
                        ],
                        plugins: [
                            // 配置babel插件，转换更更高版本语法
                            '@babel/plugin-proposal-class-properties',
                            "@babel/plugin-proposal-optional-chaining",
                        ]
                    }
                }
            },
        ]
    }
}
