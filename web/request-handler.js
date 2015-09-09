var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!

//Handling different http request methods
var actions = {
  'OPTIONS': function(req, res) {

  },
  'GET': function(req, res) {
    helpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data) {
      console.log('our data is', data);
      res.writeHead(200, helpers.headers);
      res.end(data);
    })
  },
  'POST': function(req, res) {

  }
};

exports.handleRequest = function (req, res) {
  actions[req.method](req,res);
  // res.end(archive.paths.list);
};
