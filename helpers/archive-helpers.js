var fs = require('fs');
var path = require('path');
var _ = require('underscore');
// var parser = document.createElement('a');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt'),
  'index' : path.join(__dirname, '../web/public/index.html'),
  'loading' : path.join(__dirname, '../web/public/loading.html'),
  'log' : path.join(__dirname, '../web/public/log.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(){
};

exports.isUrlInList = function(request, response, defaultHeaders){
  // path = www.google.com
  //if path is in sites.txt: if so, run cb some way
  // parser.href = "http:/"+ request.url;
  // var pathtoCheck = parser.hostname;
  var fileToCheck =__dirname+ "/../archives/sites" + request.url;
  console.log('fileToCheck:   ', fileToCheck);
  fs.open(fileToCheck, 'r', function(err, fd){
    if (err){
      console.log('error thrown', err);
      response.writeHead(404, defaultHeaders);
      response.end();
    } else {
      console.log('no error, receive data');
      fs.readFile(fileToCheck, "UTF-8", function(err, data){
        defaultHeaders['Content-Type'] = 'text/html';
        response.writeHead(200, defaultHeaders);
        response.end(data);
      });
    }
  });
  // /www.google.com
  // case: is in sites.txt, cb = "making a new response, with data"
};

exports.addUrlToList = function(){
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};
