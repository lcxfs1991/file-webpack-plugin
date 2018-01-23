# file-webpack-plugin

offer extra file capacity for webpack

[![NPM Version](https://img.shields.io/npm/v/file-webpack-plugin.svg?style=flat)](https://www.npmjs.com/package/file-webpack-plugin)
[![Travis](https://img.shields.io/travis/lcxfs1991/file-webpack-plugin.svg)](https://travis-ci.org/lcxfs1991/file-webpack-plugin)
[![AppVeyor](https://img.shields.io/appveyor/ci/lcxfs1991/file-webpack-plugin.svg)](https://ci.appveyor.com/project/lcxfs1991/file-webpack-plugin)
[![Deps](https://david-dm.org/lcxfs1991/file-webpack-plugin.svg)](https://david-dm.org/lcxfs1991/file-webpack-plugin)


## Installation and Usage

```javascript
npm i --save-dev file-webpack-plugin

var FileWebpackPlugin = require('file-webpack-plugin');

```

webpack.config.js
```javascript

	var webpackconfig = {
		entry: {
			.....
		},
		plugins: [
			new FileWebpackPlugin({
	            'emit': function() {
	            	// expose fs-extra and glob apis for developers
	                var fs = this.fs;
	                var glob = this.glob;
	            },
	            'after-emit': [
	                {
	                    from: path.join(config.path.dist + '/after-emit1', '**/*'),
	                    to: path.join(config.path.dist + '/after-emit1', 'cdn/'),
	                    action: 'move',
	                    options: {
	                        cwd: config.path.dist + '/after-emit1',
	                        ignore: [
	                            '*.html',
	                            '**/*.html'
	                        ]
	                    }
	                },
	            ],
				'done': function() {
	            	// expose fs-extra and glob apis for developers
	                var fs = this.fs;
	                var glob = this.glob;
	            },
	        }),
		]
	}

```

## Demos

If you wanna see demos, you can checkout `test/src`. Then run `npm run pretest` to see the results. Detailed descriptions for each demo is in `runWebpack/index.js`.


## Options

- `emit`:
    - is optional
    - [Function|Array]
    - Function, the funciton is called when webpack dispatch `emit` event which mean assets before emit. you can use `this.fs` and `this.glob` to use `fs-extra` and `glob` apis.
    - Array, each items should be object.
    	- from: [glob](https://www.npmjs.com/package/glob) pattern 
    	- to: file destination folder
    	- action: move => move files, copy => copy files
    	- options: [glob options](https://www.npmjs.com/package/glob#options)

- `after-emit`:
	- is optional
    - [Function|Array]
    - Function, the funciton is called when webpack dispatch `after-emit` event which mean assets after emit. you can use `this.fs` and `this.glob` to use `fs-extra` and `glob` apis.
    - Array, each items should be object.
    	- from: [glob](https://www.npmjs.com/package/glob) pattern 
    	- to: file destination folder
    	- action: move => move files, copy => copy files
    	- options: [glob options](https://www.npmjs.com/package/glob#options)

- `done`:
    - is optional
    - [Function|Array]
    - Function, the funciton is called when webpack dispatch `done` event which mean assets before emit. you can use `this.fs` and `this.glob` to use `fs-extra` and `glob` apis. 
    - Array, each items should be object.
    	- from: [glob](https://www.npmjs.com/package/glob) pattern 
    	- to: file destination folder
    	- action: move => move files, copy => copy files
    	- options: [glob options](https://www.npmjs.com/package/glob#options)
