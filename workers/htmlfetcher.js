// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('/Users/student/Codes/2015-08-web-historian/helpers/archive-helpers');
archive.readListOfUrls(archive.downloadUrls);