var fs = require('fs');
var path = require('path');
var http = require('http');
var httpreq = require('http-request');
var _ = require('underscore');
var request = require("request");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */ 

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

//Archive helper functions

exports.readListOfUrls = function(callback) {
  //Read through text file, and returns an array of all the website names
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      throw err;
    };
    var listOfUrls = data.split('\n');
    callback(listOfUrls); 
  });
};

exports.isUrlInList = function(archivedSiteUrl, callback) {
  //Call readListOfUrls. Passit a callback function
  exports.readListOfUrls(function(listOfUrls){
    var isInListOfUrls = listOfUrls.indexOf(archivedSiteUrl) > -1;
    callback(isInListOfUrls);
  })
};

exports.addUrlToList = function(archivedSiteUrl, callback) {
  // callback();
  exports.isUrlInList(archivedSiteUrl, function(isInList) {
    console.log(isInList);
    if (!isInList) {
      // console.log(exports.paths.list, archivedSiteUrl);
      fs.appendFile(exports.paths.list, archivedSiteUrl + '\n', 'utf8', function(err) {
        if (err) {
          throw err;
        }
        callback(function(data) {
          console.log("I should be downloading stuff at", data);
          exports.downloadUrls(data, function() {
            console.log("I downloaded stuff.");
          });
        })
      });
      // exports.readListOfUrls(function(data) {
      //   console.log('Our list of URLs is', data);
      // })
    }
  });
};

exports.readUrlsInArchive = function(callback) {
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) {
      throw err;
    }
    console.log("files are", files);
    callback(files);
  })
}

exports.isUrlArchived = function(archivedSiteUrl, callback) {
  exports.readUrlsInArchive(function(filesInArchive) {
    var isUrlInArchive = filesInArchive.indexOf(archivedSiteUrl) > -1;
    callback(isUrlInArchive);
  });
};

exports.downloadUrls = function(urlArray, callback) {
  //check if url is archived
  _.each(urlArray, function(url) {
    exports.isUrlArchived(url, function(isUrlInArchive) {
      if (!isUrlInArchive) {
        console.log("I am currently downloading     ", url);
        // var file = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
        // var request = http.get('http://' + url, function(response) {
        //   response.pipe(file);
        //   file.on('finish', function() {
        //     console.log("I finished writing!!");
        //     file.close(callback);
        //   });
        // }).on('error', function(err) {
        //   fs.unlink(exports.paths.archivedSites + '/' + url);
        //   if (callback) {callback(err.message)};
        // })

        request.get({url: "http://" + url, encoding: "utf8"}, function(err, response, body) {
          fs.writeFile(exports.paths.archivedSites + '/' + url, body, "utf8", function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("The file was saved");
            }
          })


        })
        // httpreq.get('http://' + url, exports.paths.archivedSites + '/' + url, function(err, res) {
        //   if (err) {
        //     throw err;
        //   } else {
        //     console.log("Download");
        //   }
        // })  
      }
    })


    
  })
};








