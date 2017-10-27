"use strict";

const fs = require('fs-extra'),
	  async = require("async"),
	  webpack = require('webpack'),
	  path = require('path');
	
fs.removeSync(path.resolve('./test/dist/'));
fs.removeSync(path.resolve('./test/pub/'));
fs.removeSync(path.resolve('./test/dev/'));

var basePath = path.resolve('./test/src/');

var webpackConfig = [
	require(basePath + '/after-emit1/webpack.config.js'),  // move files
	require(basePath + '/after-emit2/webpack.config.js'),  // copy files
	require(basePath + '/after-emit3/webpack.config.js'),  // after-emit & emit callback & done callback
	require(basePath + '/emit1/webpack.config.js'),  // move fail
	require(basePath + '/emit2/webpack.config.js'),  // copy fail
	require(basePath + '/emit3/webpack.config.js'),  // move success
	require(basePath + '/emit4/webpack.config.js'),  // copy success
];

async.filter(webpackConfig, function(configPath, callback) {
	let compiler = webpack(configPath);
	compiler.run(function(err, stats) {
		callback();
	});
}, function(err, results){
    if (!err) {
    	// console.log(results);
    }
    else {
    	console.log(err);
    }
});