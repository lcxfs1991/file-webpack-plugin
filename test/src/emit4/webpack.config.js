"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	nodeModulesPath = path.resolve('../node_modules'),
    fs = require('fs-extra');

fs.writeFileSync(path.join(config.path.src, 'emit4/index.html'), '', 'utf-8');
fs.writeFileSync(path.join(config.path.src, 'emit4/detail.html'), '', 'utf-8');

var HtmlResWebpackPlugin = require('html-res-webpack-plugin'),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"),
    CopyWebpackPlugin = require('copy-webpack-plugin-hash'),
    FileWebpackPlugin = require('../../../index');

module.exports = {
    context: config.path.src,
	entry: {
        'index': [path.join(config.path.src, "/emit4/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/emit4'),
        filename: "js/[name].js",
        chunkFilename: "chunk/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: false,
                    presets: [
                        'es2015',
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            localIdentName: '[name]-[local]-[hash:base64:5]',
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    "url-loader?limit=1000&name=img/[name].[ext]",
                ],
                include: path.resolve(config.path.src)
            },
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].css"
        }),
        new CopyWebpackPlugin([
            {
                from: config.path.src + '/emit4/libs/',
                to: 'libs/[path][name].[ext]'
            }
        ]),
        new HtmlResWebpackPlugin({
            mode: "html",
            entryLog: true,
        	filename: "./index.html",
	        template: config.path.src + "/emit4/index.html",
	        templateContent: function(tpl) {
	            // 生产环境不作处理
	            if (!this.webpackOptions.watch) {
                    return tpl;
                }
	            // 开发环境先去掉外链react.js
	            var regex = new RegExp("<script.*src=[\"|\']*(.+).*?[\"|\']><\/script>", "ig");
	            tpl = tpl.replace(regex, function(script, route) {
	                if (!!~script.indexOf('react.js') || !!~script.indexOf('react-dom.js')) {
	                    return '';
	                }
	                return script;
	            });
	            return tpl;
	        },
	        htmlMinify: null
        }),
        new FileWebpackPlugin({
            'log': true,
            'emit': [
                {
                    from: '*.html', //path.join(config.path.src + '/emit4', '*.html'),
                    to: path.join(config.path.dist + '/emit4'),
                    // modifyTo: function(to) {
                    //     return to.replace('/src/', '/dist/');
                    // },
                    action: 'copy',
                    options: {
                        cwd: config.path.src + '/emit4',
                    }
                }
            ]
        }),
    ],
};
