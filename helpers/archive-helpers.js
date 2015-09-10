var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

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
  // callback = callback || exports.readListOfUrls;
  // callback(function(data) {
    // return data.indexOf(archivedSiteUrl) > -1 ? true : false;
  // })
};

exports.addUrlToList = function(archivedSiteUrl, callback) {
  // callback();
  exports.isUrlInList(archivedSiteUrl, function(isInList) {
    if (!isInList) {
      // console.log(exports.paths.list, archivedSiteUrl);
      fs.writeFile(exports.paths.list, archivedSiteUrl, 'utf8', function(err) {
        if (err) {
          throw err;
        }
        callback();
      });
      exports.readListOfUrls(function(data) {
        console.log('Our list of URLs is', data);
      })
    }
  });
    

  //If .isUrlInList returns false
    //Add the url to the .txt file in archives.
};

exports.isUrlArchived = function(archivedSiteUrl, callback) {
  fs.readdir(archivedSiteUrl, function(err, files) {
    if (err) {
      throw err;
    }
    console.log("files are", files);
    callback(files);
  })
  // returns true or false depending on if there is a file named `archivedURL`
  // in the archived sites folder
};

exports.downloadUrls = function() {
};
