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

    if (_.isArray(options['done'])) {
		this.doneArray = options['done'] || [];
	}
}

/**
 * @param  {Object} Compiler
 * @return {[type]}
 */
FileWebpackPlugin.prototype.apply = function(compiler) {

    compiler.hooks.emit.tapAsync("emit", (compilation, callback) => {
  		this.emitCallback && this.emitCallback();

  		this.processFiles(compiler, compilation, this.emitArray);
	    callback();
	});


  	// right after emit, files will be generated
    compiler.hooks.afterEmit.tapAsync("after-emit", (compilation, callback) => {
		this.afterEmitCallback && this.afterEmitCallback();
		this.processFiles(compiler, compilation, this.afterEmitArray);
	    callback();
	});

	// done
	compiler.hooks.done.tap("done", () => {
        this.doneCallback && this.doneCallback();

        this.processFiles(compiler, null, this.doneArray);
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
            item.options = item.options || {};
            item.options.cwd = item.options.cwd || compiler.context;
            item.to = item.to || '';

            let actionFunc = fs.moveSync;

            if (item.action === 'copy') {
                actionFunc = fs.copySync;
            }
            else if (item.action === 'del') {
                actionFunc = fs.removeSync;
            }

            let files = glob.sync(item.from, item.options);

            let folders = [];

			files.reverse().forEach((file) => {
				let from = (path.isAbsolute(file)) ? file : path.join(item.options.cwd, file),
				    to = path.join(item.to, path.relative(item.options.cwd, from));

                // function for modifying to / from path
				let modifyTo = item.modifyTo || null,
					modifyFrom = item.modifyFrom || null;

				to = (modifyTo) ? modifyTo(to) : to;
				from = (modifyFrom) ? modifyFrom(from) : from;

                this.info(path.resolve(from) + ' => ' + to);

				if (fs.existsSync(from)) {
                    // del
                    if (item.action === 'del') {
                        actionFunc(from);
                    }
                    // move or copy
                    else {
                        if (fs.lstatSync(from).isDirectory()) {
                            fs.ensureDirSync(to);
                            folders.push(from);
                        }
                        else {
                            fs.ensureFileSync(to);
                            actionFunc(from, to, { overwrite: true });
                        }
                    }
				}
            });

            // if folder is empty, then remove it
            folders.forEach((folder) => {
                let info = fs.readdirSync(folder);
                if (!info.length) {
                    fs.removeSync(folder);
                }
            });

		});
	}
};

FileWebpackPlugin.prototype.info = function(msg) {
	this.log && console.log(chalk.cyan(msg));
};

module.exports = FileWebpackPlugin;
