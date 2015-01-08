var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var defaultHeaders = helpers.headers;
var http = require('http');
var fs = require('fs');
var _ = require('underscore');
// var parser = document.createElement('a');

// var sendResponse = function(statusCode, headers, cb, cbPath, cbEncoding) {
//   defaultHeaders['Content-Type'] = headers;
//   if (cb) {
//   }
// };

var requestType = {
  'GET': function(request, response){
    var statusCode = 200;

    if (request.url === "/"){
      defaultHeaders['Content-Type'] = 'text/html';
      response.writeHead(statusCode, defaultHeaders);
      fs.readFile(archive.paths['index'], 'UTF-8', function(err, data){
        response.end(data);
      });
    } else {
      archive.isUrlInList(request, response, defaultHeaders);
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
  if (requestType[req.method]) {
    requestType[req.method](req, res);
  }
};
