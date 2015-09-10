var pathHelper = require('path');
var fs = require('fs');
var qs = require('querystring');
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

// based on the path / path-length, will tell us where to serve the assets from.
var contentTypes = {
  '.jpg' : 'image/jpeg',
  '.css' : 'text/css',
  // '.html' : 'text/html',
  // '.htm' : 'text/html',
  '.png' : 'image/png',
  '.gif': 'image/gif'
}

//Handling different http request methods
exports.actions = {
  'OPTIONS': function(req, res) {

  },

  'GET': function(req, res) {
    var path = url.parse(req.url).pathname;
    var extension = pathHelper.extname(path);
    //We serve index.html when the path is '/'
    if (path === '/') {
      exports.serveAssets(res, archive.paths.siteAssets + '/index.html', function(data) {
        exports.headers["Content-Type"] = "text/html";
        res.writeHead(200, exports.headers);
        res.end(data);
      })
    } else if (contentTypes[extension]) {
      //When any page serves files with mime types found in our contentTypes object, give them
      // the correct mime types.
      exports.serveAssets(res, archive.paths.siteAssets + '/' + path, function(data) {
        exports.headers["Content-Type"] = contentTypes[extension];
        res.writeHead(200, exports.headers);
        res.end(data);
      })
    } 
    else {

      archive.isUrlInList(path, function(isInList) {
        if (isInList) {
          archive.isUrlArchived(path, function(isInArchive) {
            if (isInArchive) {
              exports.serveAssets(res, archive.paths.archivedSites + '/' + path, function(data) {
                exports.headers["Content-Type"] = "text/html";
                res.writeHead(200, exports.headers);
                res.end(data);
              })
            } else {
              exports.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
                exports.headers["Content-Type"] = "text/html";
                res.writeHead(200, exports.headers);
                res.end(data);
              })
            }
          })
        } else {
          archive.addUrlToList(path, archive.readListOfUrls);
          exports.serveAssets(res, archive.paths.siteAssets + '/loading.html', function(data) {
                exports.headers["Content-Type"] = "text/html";
                res.writeHead(200, exports.headers);
                res.end(data);
          });
        }
      })




      // archive.isUrlArchived(path.slice(1), function(isUrlInArchive) {
      //   console.log("Is the url in the archive?  ", isUrlInArchive);
      //   console.log("The current path is   ", path);
      //   if (isUrlInArchive) {
      //     exports.serveAssets(res, archive.paths.archivedSites + path, function(data) {
      //       res.writeHead(200, exports.headers);
      //       res.end(data);
      //     })
      //   } else {
      //     res.writeHead(404, exports.headers);
      //     res.end("Not Found.");
      //   }
      // })
    }
  },



  'POST': function(req, res) {
    // var path = pathName(req.url);
    console.log("-----------------");

    var body = '';
    var path;
    req.on('data', function(data) {
      body += data;
    })
    req.on('end', function() {
      var post = qs.parse(body);
      archive.addUrlToList(post.url, archive.readListOfUrls);  

      exports.actions.GET(post, res);
    });
  }
};

  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

// As you progress, keep thinking about what helper functions you can put here!
