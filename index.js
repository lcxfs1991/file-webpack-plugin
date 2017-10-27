"use strict";
/**
 * @plugin file-webpack-plugin
 * @author  heyli
 */

const fs = require('fs-extra'),
      path = require('path'),
      _ = require('lodash'),
      glob = require('glob'),
      chalk = require('chalk'),
	  emptyCallback = function() {};

function FileWebpackPlugin(options) {
	this.fs = fs;
	this.glob = glob;
	this.context = null;
	this.log = options.log || false;

	if (_.isFunction(options['emit'])) {
		this.emitCallback = options['emit'] || emptyCallback;
		this.emitCallback = this.emitCallback.bind(this);
	}

	if (_.isFunction(options['after-emit'])) {
		this.afterEmitCallback =   options['after-emit'] || emptyCallback;
		this.afterEmitCallback = this.afterEmitCallback.bind(this);
	}

	if (_.isFunction(options['done'])) {
		this.doneCallback =   options['done'] || emptyCallback;
		this.doneCallback = this.doneCallback.bind(this);
	}

	if (_.isArray(options['emit'])) {
		this.emitArray = options['emit'] || [];
	}

	if (_.isArray(options['after-emit'])) {
		this.afterEmitArray = options['after-emit'] || [];
	}
}

/**
 * @param  {Object} Compiler
 * @return {[type]}
 */
FileWebpackPlugin.prototype.apply = function(compiler) {

  	compiler.plugin("emit", (compilation, callback) => {
  		this.emitCallback && this.emitCallback();

  		this.processFiles(compiler, compilation, this.emitArray);
	    callback();
	});


  	// right after emit, files will be generated
	compiler.plugin("after-emit", (compilation, callback) => {
		this.afterEmitCallback && this.afterEmitCallback();

		this.processFiles(compiler, compilation, this.afterEmitArray);
	    callback();
	});

	// done
	compiler.plugin("done", () => {
		this.doneCallback && this.doneCallback();
	});

};


/**
 * @param  {Object} Compiler
 * @param  {Object} Compilation
 * @param  {Array} file array
 */
FileWebpackPlugin.prototype.processFiles = function(compiler, compilation, fileArray) {

	if (fileArray) {
		fileArray.forEach((item) => {
		
			item.options.cwd = item.options.cwd || compiler.context;

			let actionFunc = item.action === 'move' ? fs.moveSync : fs.copySync,
				files = glob.sync(item.from, item.options);

			files.forEach((file) => {

				let from = (path.isAbsolute(file)) ? file : path.join(item.options.cwd, file),
				    to = path.join(item.to, path.relative(item.options.cwd, from));

				let modifyTo = item.modifyTo || null,
					modifyFrom = item.modifyFrom || null;

				to = (modifyTo) ? modifyTo(to) : to;
				from = (modifyFrom) ? modifyFrom(from) : from;

				this.info(from + ' => ' + to);
				
				if (fs.existsSync(from)) {
					actionFunc(from, to, { overwrite: true });
				}

			});

		});
	}
};

FileWebpackPlugin.prototype.info = function(msg) {
	this.log && console.log(chalk.cyan(msg));
};

module.exports = FileWebpackPlugin;