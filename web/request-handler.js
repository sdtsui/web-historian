var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers.js');
var defaultHeaders = helpers.headers;
var http = require('http');
var fs = require('fs');
var _ = require('underscore');

var requestType = {
  'GET': function(request, response){
    var statusCode = 200;
    response.writeHead(statusCode, defaultHeaders);
    var directory = archive.paths.archivedSites + request.url;
    fs.readFile(directory, 'utf8', function(err, data){
      response.end(data);
    });
  },

  'POST': function(request, response){
    // send req.URL > sites.txt
    // response should affect the client
      // render loading.html
    var statusCode = 302;
    response.writeHead(statusCode, defaultHeaders);
    response.end();
  }
}

exports.handleRequest = function (req, res) {
  console.log('req', req);
  if (requestType[req.method]) {
    requestType[req.method](req, res);
  }
};

