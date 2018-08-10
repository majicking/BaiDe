/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    angular.module('app')
        .directive('hideTabs', function ($rootScope) {
            return {
                restrict: 'A',
                link: function(scope, element, attributes) {
                    scope.$on('$ionicView.beforeEnter', function() {
                        scope.$watch(attributes.hideTabs, function(value){
                            $rootScope.hideTabs = value;
                        });
                    });
                    scope.$on('$ionicView.beforeLeave', function() {
                        scope.$watch(attributes.hideTabs, function(value){
                            $rootScope.hideTabs = value;
                        });
                        scope.$watch('$destroy',function(){
                            $rootScope.hideTabs = false;
                        })
                    });
                }
            };
        });
})();