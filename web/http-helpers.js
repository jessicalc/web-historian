var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, function(err, data) {
    if (err) {
      throw err;
    };
    callback(data);
  });
};

// takes the URL inputted by the user, and gives us the path from it
// i.e. 127.0.0.1:3000/www.google.com --> www.google.com
// i.e. 127.0.0.1:3000/ --> "" ???
var pathName = function(inputUrl) {
  return url.parse(inputUrl).pathname;
};

// based on the path / path-length, will tell us where to serve the assets from.
var assetFinder = function(path) {
  var code = 200;
  console.log(path);
  if (path === "/") {
    return { 
      path: archive.paths.siteAssets + '/index.html',
      statusCode: code
    };
  }
  if (!archive.isUrlInList(path.slice(1))) {
    return {
      path: null,
      statusCode: 404
    }
  } else {
      return {
      path: archive.paths.archivedSites + path,
      statusCode: code
    }
  }

};

//Handling different http request methods
exports.actions = {
  'OPTIONS': function(req, res) {

  },
  'GET': function(req, res) {
    var path = pathName(req.url);
    var asset = assetFinder(path);
    if (asset.path === null) {
      res.writeHead(asset.statusCode, exports.headers);
      res.end("Not Found");
    } else {
      exports.serveAssets(res, asset.path, function(data) {
        console.log('our path is', asset.path);
        // helpers.headers['Content-Type'] = contentType;
        res.writeHead(asset.statusCode, exports.headers);
        res.end(data);
      })
    };
  },
  'POST': function(req, res) {

  }
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!
