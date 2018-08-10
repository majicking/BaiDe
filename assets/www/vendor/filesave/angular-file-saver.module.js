'use strict';

/*
*
* A AngularJS module that implements the HTML5 W3C saveAs() in browsers that
* do not natively support it
*
* (c) 2015 Philipp Alferov
* License: MIT
*
*/

module.exports = 'ngFileSaver';

angular.module('ngFileSaver', [])
  .factory('FileSaver', ['Blob', 'SaveAs', 'FileSaverUtils', require('./angular-file-saver.service')])
  .factory('FileSaverUtils', [require('./utils.service.js')])
  .factory('Blob', ['$window', 'FileSaverUtils', require('./lob.service.js')])
  .factory('SaveAs', ['$window', 'FileSaverUtils', require('./file-saver.service.js')]);
