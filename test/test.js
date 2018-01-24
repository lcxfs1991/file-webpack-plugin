'use strict';

const path = require('path'),
      expect = require('chai').expect,
	  fs = require('fs-extra');

const TEST = path.resolve('test');

describe('after-emit', function() {
  	it('=> move files', function() {

        let folder =  path.join(TEST, 'dist/after-emit1');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['cdn', 'webserver']);

        let cdnFolder = path.join(TEST, 'dist/after-emit1/cdn'),
        	cdnFileInfo = fs.readdirSync(cdnFolder);
        expect(cdnFileInfo).to.deep.equal(['css', 'img', 'js', 'libs']);

        let htmlFolder = path.join(TEST, 'dist/after-emit1/webserver'),
        	htmlFileInfo = fs.readdirSync(htmlFolder);
        expect(htmlFileInfo).to.deep.equal(['index.html']);

  	});

  	it('=> copy files', function() {

        let folder =  path.join(TEST, 'dist/after-emit2');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['css', 'dev', 'img', 'index.html', 'js', 'libs']);

        let devfolder =  path.join(TEST, 'dist/after-emit2/dev/');
        let devFileInfo = fs.readdirSync(devfolder);
        expect(devFileInfo).to.deep.equal(['cdn', 'webserver']);

        let cdnFolder = path.join(TEST, 'dist/after-emit2/dev/cdn'),
        	cdnFileInfo = fs.readdirSync(cdnFolder);
        expect(cdnFileInfo).to.deep.equal(['css', 'img', 'js', 'libs']);

        let htmlFolder = path.join(TEST, 'dist/after-emit2/dev/webserver'),
        	htmlFileInfo = fs.readdirSync(htmlFolder);
        expect(htmlFileInfo).to.deep.equal(['index.html']);

  	});

});

describe('callback', function() {
	it('=> after-emit & emit callback & done callback', function() {

        let pubFolder =  path.join(TEST, 'pub/after-emit3/webserver');
        let fileInfo = fs.readdirSync(pubFolder);
        expect(fileInfo).to.deep.equal(['index.html']);

        let pubCdnFolder =  path.join(TEST, 'pub/after-emit3/cdn1');
        let cssFileInfo = fs.readdirSync(pubCdnFolder);
        expect(cssFileInfo).to.deep.equal(['index.css']);

        let devfolder =  path.join(TEST, 'dev/after-emit3/cdn/');
        let devFileInfo = fs.readdirSync(devfolder);
        expect(devFileInfo).to.deep.equal(['google.png']);

  	});
});

describe('emit', function() {
	it('=> move fail', function() {

        let folder =  path.join(TEST, 'dist/emit1');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['css', 'img', 'index.html', 'js', 'libs']);

  	});

  	it('=> copy fail', function() {

        let folder =  path.join(TEST, 'dist/emit2');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['css', 'img', 'index.html', 'js', 'libs']);

  	});

  	it('=> move succes', function() {

        let folder =  path.join(TEST, 'dist/emit3');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['css', 'detail.html', 'img', 'index.html', 'js', 'libs']);

        let srcfolder =  path.join(TEST, 'src/emit3');
        let srcFileInfo = fs.readdirSync(srcfolder);
        expect(srcFileInfo).to.deep.equal(['google.png', 'index.css', 'index.js', 'libs', 'webpack.config.js']);

  	});

  	it('=> copy success', function() {

        let folder =  path.join(TEST, 'dist/emit4');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['css', 'detail.html', 'img', 'index.html', 'js', 'libs']);

        let srcfolder =  path.join(TEST, 'src/emit4');
        let srcFileInfo = fs.readdirSync(srcfolder);
        expect(srcFileInfo).to.deep.equal(['detail.html', 'google.png', 'index.css', 'index.html', 'index.js', 'libs', 'webpack.config.js']);

  	});
});


describe('done', function() {
    it('=> move files', function() {

      let folder =  path.join(TEST, 'dist/done1');
      let fileInfo = fs.readdirSync(folder);
      expect(fileInfo).to.deep.equal(['cdn', 'webserver']);

      let cdnFolder = path.join(TEST, 'dist/done1/cdn'),
          cdnFileInfo = fs.readdirSync(cdnFolder);
      expect(cdnFileInfo).to.deep.equal(['css', 'img', 'js', 'libs']);

      let htmlFolder = path.join(TEST, 'dist/done1/webserver'),
          htmlFileInfo = fs.readdirSync(htmlFolder);
      expect(htmlFileInfo).to.deep.equal(['index.html']);

    });

    it('=> copy files', function() {

      let folder =  path.join(TEST, 'dist/done2');
      let fileInfo = fs.readdirSync(folder);
      expect(fileInfo).to.deep.equal(['css', 'dev', 'img', 'index.html', 'js', 'libs']);

      let devfolder =  path.join(TEST, 'dist/done2/dev/');
      let devFileInfo = fs.readdirSync(devfolder);
      expect(devFileInfo).to.deep.equal(['cdn', 'webserver']);

      let cdnFolder = path.join(TEST, 'dist/done2/dev/cdn'),
          cdnFileInfo = fs.readdirSync(cdnFolder);
      expect(cdnFileInfo).to.deep.equal(['css', 'img', 'js', 'libs']);

      let htmlFolder = path.join(TEST, 'dist/done2/dev/webserver'),
          htmlFileInfo = fs.readdirSync(htmlFolder);
      expect(htmlFileInfo).to.deep.equal(['index.html']);

    });

    it('=> move files with sourcemap', function() {

        let folder =  path.join(TEST, 'dist/done3');
        let fileInfo = fs.readdirSync(folder);
        expect(fileInfo).to.deep.equal(['cdn', 'webserver']);

        let cdnFolder = path.join(TEST, 'dist/done3/cdn'),
            cdnFileInfo = fs.readdirSync(cdnFolder);
        expect(cdnFileInfo).to.deep.equal(['css', 'img', 'js', 'libs']);

        let htmlFolder = path.join(TEST, 'dist/done3/webserver'),
            htmlFileInfo = fs.readdirSync(htmlFolder);
        expect(htmlFileInfo).to.deep.equal(['index.html']);

        let cdnCssFolder = path.join(TEST, 'dist/done3/cdn/css/js'),
            cdnCssInfo = fs.readdirSync(cdnCssFolder);
        expect(cdnCssInfo).to.deep.equal(['index.css']);

        let cdnJsFolder = path.join(TEST, 'dist/done3/cdn/js'),
            cdnJsInfo = fs.readdirSync(cdnJsFolder);
        expect(cdnJsInfo).to.deep.equal(['index.js']);

      });

});
