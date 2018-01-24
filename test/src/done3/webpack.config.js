"use strict";

const path = require('path');

var webpack = require('webpack'),
	config = require('../../config/config'),
	nodeModulesPath = path.resolve('../node_modules'),
    fs = require('fs');


var HtmlResWebpackPlugin = require('html-res-webpack-plugin'),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
    CopyWebpackPlugin = require('copy-webpack-plugin-hash'),
    FileWebpackPlugin = require('../../../index');

module.exports = {
    context: config.path.src,
	entry: {
        'js/index': [path.join(config.path.src, "/done3/index")],
    },
    output: {
        publicPath: config.defaultPath,
        path: path.join(config.path.dist + '/done3'),
        filename: "[name].js",
        chunkFilename: "chunk/[name].js",
    },
    devtool: 'hidden-source-map',
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: false,
                    presets: [
                        'es2015',
                    ]
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                localIdentName: '[name]-[local]-[hash:base64:5]',
                            }
                        }
                    ]
                }),
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
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: "css/[name].css", disable: false}),
        new CopyWebpackPlugin([
            {
                from: config.path.src + '/done3/libs/',
                to: 'libs/[path][name].[ext]'
            }
        ]),
        new HtmlResWebpackPlugin({
            mode: "html",
            entryLog: true,
        	filename: "./index.html",
	        template: config.path.src + "/done3/index.html",
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
            'emit': function() {

            },
            'done': [
                {
                    from: path.join(config.path.dist + '/done3', '**/*.*.map'),
                    action: 'del',
                    options: {
                        cwd: config.path.dist + '/done3',
                    }
                },
                {
                    from: path.join(config.path.dist + '/done3', '**/*'),
                    to: path.join(config.path.dist + '/done3', 'cdn/'),
                    action: 'move',
                    options: {
                        cwd: config.path.dist + '/done3',
                        ignore: [
                            // '**/*.*.map',
                            '*.html',
                            '**/*.html'
                        ]
                    }
                },
                {
                    from: path.join(config.path.dist + '/done3', '*.html'),
                    to: path.join(config.path.dist + '/done3', 'webserver/'),
                    action: 'move',
                    options: {
                        cwd: config.path.dist + '/done3',
                    }
                }
            ]
        }),
    ],
};
