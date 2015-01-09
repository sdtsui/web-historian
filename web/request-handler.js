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
      archive.GETUrlInList(request, response, defaultHeaders);
    }

  },

  'POST': function(request, response){
    archive.POSTUrlInList(request, response, defaultHeaders);
  },

  '404': function(request, response) {
    response.writeHead(404, defaultHeaders);
    response.end();
  }
}

exports.handleRequest = function (req, res) {
  fs.appendFile(__dirname + 'public/log.txt', 'test', function(err){});
  console.log('test string here');
  if (requestType[req.method]) {
    requestType[req.method](req, res);
  };
};
