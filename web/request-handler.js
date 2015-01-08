var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var defaultHeaders = helpers.headers;
var http = require('http');
var fs = require('fs');
var _ = require('underscore');

var requestType = {
  'GET': function(request, response){
    // console.log('request', request);
    var statusCode = 200;
    defaultHeaders['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, defaultHeaders);
    if (request.url === "/"){
      defaultHeaders['Content-Type'] = 'text/html';
      response.writeHead(statusCode, defaultHeaders);
      var indexPath = archive.paths['index'];
      fs.readFile(indexPath, 'UTF-8', function(err, data){
        response.end(data);
      });
    }
    var directory = archive.paths.archivedSites + request.url;
    fs.readFile(directory, 'UTF-8', function(err, data){
      response.end(data);
    });
  },

  'POST': function(request, response){
    var archiveLoc = archive.paths['list'];

    var postingAddress = request._postData['url'] + '\n';
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
    var loadPath = archive.paths['loading'];
    fs.readFile(loadPath, 'UTF-8', function(err, data) {
      defaultHeaders['Content-Type'] = 'text/html';
      response.writeHead(statusCode, defaultHeaders);
      response.end(data);
    })
  }
}

exports.handleRequest = function (req, res) {
  console.log('req');
  if (requestType[req.method]) {
    requestType[req.method](req, res);
  }
};
