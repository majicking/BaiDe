/**
 * Created by lifeng on 2016/1/17.
 */
(function () {
    'use strict';

    angular.module('app')
        .constant("$ionicLoadingConfig", {
            noBackdrop: true,
            template: '<ion-spinner class="spinner-stable" icon="circles"></ion-spinner>'
        })
        .config(
            ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$sceDelegateProvider',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide, $sceDelegateProvider) {
                    // lazy controller, directive and service
                    angular.module('app').controller = $controllerProvider.register;
                    angular.module('app').directive = $compileProvider.directive;
                    angular.module('app').filter = $filterProvider.register;
                    angular.module('app').factory = $provide.factory;
                    angular.module('app').service = $provide.service;
                    angular.module('app').constant = $provide.constant;
                    angular.module('app').value = $provide.value;
                }
            ]
        )
        .config(
            ['$httpProvider',
                function ($httpProvider) {
                    $httpProvider.interceptors.push('TokenInterceptor');
                    $httpProvider.interceptors.push('HttpInterceptor');
                }
            ]
        ).config(function ($ionicNativeTransitionsProvider) {
            $ionicNativeTransitionsProvider.setDefaultOptions({
                duration: 200, // in milliseconds (ms), default 400,
                slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
                iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
                androiddelay: -1, // same as above but for Android, default -1
                winphonedelay: -1, // same as above but for Windows Phone, default -1,
                fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
                fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
                triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
                backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
            });
        }).config(function ($ionicNativeTransitionsProvider) {
            $ionicNativeTransitionsProvider.setDefaultTransition({
                type: 'slide',
                direction: 'left'
            });
            $ionicNativeTransitionsProvider.setDefaultBackTransition({
                type: 'slide',
                direction: 'right'
            });
        });
})();