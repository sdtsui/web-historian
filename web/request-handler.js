var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var defaultHeaders = helpers.headers;
var http = require('http');
var fs = require('fs');
var _ = require('underscore');

// var sendResponse = function(statusCode, headers, cb, cbPath, cbEncoding) {
//   defaultHeaders['Content-Type'] = headers;
//   if (cb) {
//   }
// };

var urlType = {
  "/": true
};

var requestType = {
  'GET': function(request, response){
    //**Refactor two cases, 404s
    // console.log('request', request);
    var statusCode = 200;

    if (request.url === "/"){
      defaultHeaders['Content-Type'] = 'text/html';
      response.writeHead(statusCode, defaultHeaders);
      fs.readFile(archive.paths['index'], 'UTF-8', function(err, data){
        response.end(data);
      });
    }

    defaultHeaders['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, defaultHeaders);
    var directory = archive.paths.archivedSites + request.url;
    // use fs.open() instead of fs.exists() to check for existence;
      // need to learn how to handle exceptions.
    var dirExists = fs.exists(directory, function(bool){ return bool; });
    var logTxt = dirExists + ', ' + directory;
    fs.appendFile(archive.paths['log'], logTxt);
    if (!!dirExists) {
      fs.readFile(directory, 'UTF-8', function(err, data){
        response.end(data);
      });
    } else {

    }

  },

  'POST': function(request, response){
    var archiveLoc = archive.paths['list'];
    var postingAddress = request._postData['url'] + '\n';

    //error logging
    var logTxt = archiveLoc + ', ' + postingAddress;
    fs.appendFile(archive.paths['log'], logTxt);

    fs.appendFile(archiveLoc, postingAddress, function(error) {
      if (error) {
        console.log('error is', error);
      } else {
        console.log('saved url to archives.sites');
      }
    });
    // response should affect the client
    var statusCode = 302;
    fs.readFile(archive.paths['loading'], 'UTF-8', function(err, data) {
      defaultHeaders['Content-Type'] = 'text/html';
      response.writeHead(statusCode, defaultHeaders);
      response.end(data);
    })
  },

  '404': function(request, response) {
    response.writeHead(404, defaultHeaders);
    response.end();
  }
}

exports.handleRequest = function (req, res) {
  if (urlType[req.url]) {
    if (requestType[req.method]) {
      requestType[req.method](req, res);
    }
  } else {
    requestType['404'](req, res);
  }
};
