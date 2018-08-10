// lazyload config
(function() {
  angular.module('app')
    // oclazyload config
      .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
          // We configure ocLazyLoad to use the lib script.js as the async loader
          $ocLazyLoadProvider.config({
              debug:  false,
              events: true,
              modules: [
              ]
          });
      }])
})();
