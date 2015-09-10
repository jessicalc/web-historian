var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// require more modules/folders here!


exports.handleRequest = function (req, res) {
  helpers.actions[req.method](req,res);
  // res.end(archive.paths.list);
};
