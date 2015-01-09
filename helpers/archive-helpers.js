var fs = require('fs');
var archive = require('../helpers/archive-helpers');
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

exports.readListOfUrls = function(cb){
  // cb must take an array
  fs.readFile(archive.paths['list'], 'UTF-8', function(err, data){
    var allUrls = data.split('\n');
    console.log('allUrls', allUrls);
    cb(allUrls);
  });
};

exports.GETUrlInList = function(request, response, defaultHeaders){
  var fileToCheck =__dirname+ "/../archives/sites" + request.url;
  console.log('fileToCheck:   ', fileToCheck);
  fs.open(fileToCheck, 'r', function(err, fd){
    if (err){
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
};

exports.POSTUrlInList = function(request, response, defaultHeaders){
  console.log('request', request);
  var fileToCheck = __dirname + "/../archives/sites" + request._postData['url'];
  console.log('fileToCheck:   ', fileToCheck);
  fs.open(fileToCheck, 'r', function(err, fd){
    if (err){
      var statusCode = 302;
      // redirect to loading
      fs.readFile(archive.paths['loading'], 'UTF-8', function(err, data) {
        defaultHeaders['Content-Type'] = 'text/html';
        response.writeHead(statusCode, defaultHeaders);
        response.end(data);
        console.log('loading redirect sent');
      });
      // write new URL to sites.txt
      var archiveLoc = archive.paths['list'];
      var postingAddress = request._postData['url'] + '\n';
      fs.appendFile(archiveLoc, postingAddress, function(error) {
        if (error) {
          console.log('error is', error);
        } else {
          console.log('saved url to archives.sites');
        }
      });
    } else {
      fs.readFile(fileToCheck, "UTF-8", function(err, data){
        defaultHeaders['Content-Type'] = 'text/html';
        response.writeHead(302, defaultHeaders);
        response.end(data);
        console.log('redirect to archived url');
      });
    }
  });
};


exports.addUrlToList = function(){
  // see POSTUrlInLinst because this works
};

exports.isURLArchived = function(){
  // see POSTUrlInLinst because this works
};

exports.downloadUrls = function(){
  // open sites.txt
  // use getArray function to get addresses to scrape
    // go to the web address on each line
    // scrape with ???
    // save to file in /sites/
};
