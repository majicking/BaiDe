(function (angular) {
    'use strict';

    var directives = angular.module('touch-events', []);

    directives.directive('ngTouchstart', function ($parse) {
        return {
            link: function(scope, element, attrs) {
                var invoker = $parse(attrs.ngTouchstart);

                element.bind('touchstart', function (event) {
                    invoker(scope, {'$event': event} );
                });
            }
        };
    });

    directives.directive('ngTouchend', function ($parse) {
        return {
            link: function(scope, element, attrs) {
                var invoker = $parse(attrs.ngTouchend);

                element.bind('touchend', function (event) {
                    invoker(scope, {'$event': event} );
                });
            }
        };
    });

    directives.directive('ngTouchmove', function ($parse) {
        return {
            link: function(scope, element, attrs) {
                var invoker = $parse(attrs.ngTouchmove);

                element.bind('touchmove', function (event) {
                    invoker(scope, {'$event': event} );
                });
            }
        };
    });

    directives.directive('ngTouchleave', function ($parse) {
        return {
            link: function(scope, element, attrs) {
                var invoker = $parse(attrs.ngTouchleave);

                element.bind('touchleave', function (event) {
                    invoker(scope, {'$event': event} );
                });
            }
        };
    });
    
})(angular);