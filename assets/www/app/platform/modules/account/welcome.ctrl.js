// 2018.04.23 by tourway
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('WelcomeCtrl', WelcomeCtrl);
    WelcomeCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$sessionStorage', '$ionicLoading', '$ionicNativeTransitions', 'WelcomeService','$cordovaScanning', '$ionicSlideBoxDelegate'];
    function WelcomeCtrl($rootScope, $scope, $stateParams, $sessionStorage, $ionicLoading, $ionicNativeTransitions, WelcomeService, $cordovaScanning, $ionicSlideBoxDelegate) {
        var vm = this;
        vm.uuid = '';
        vm.getAsset = getAsset;//固定期限
        vm.getSlide =  getSlide;//获取幻灯片图片

        vm.welComeLoginGoNativeBackParams = welComeLoginGoNativeBackParams;
        // vm.timer = timer;
        //vm.timer(2000000);
//        welcome();
        vm.getSlide();//获取幻灯片图片
        vm.getAsset();//获取list

//        function welcome() {
//            $cordovaScanning.commont("startapp", "");
//            $cordovaScanning.commont("devices", "").then(function (data) {
//                vm.uuid  = data;
//                            alert(vm.uuid);
//            });
//        }

        //登录效验
        function welComeLoginGoNativeBackParams(state, params){
            //$cordovaScanning.commont("devices", "").then(function (data) {
            //    $ionicLoading.show();
            //    vm.uuid  = data;
            //    WelcomeService.isHavePattern(vm.uuid).success(function (data) {
            //        localStorage.setItem('userPortrait',data.userPortrait);
            //        if(data.havePattern){
            //            $ionicNativeTransitions.stateGo(state, params, {}, {
            //                "type": "slide",
            //                "direction": "right"
            //            });
            //            return false;
            //        }else {
                        $ionicNativeTransitions.stateGo('login', params, {}, {
                            "type": "slide",
                            "direction": "right"
                        });
            //            return false;
            //        }
            //    }).error(function (error) {
            //    }).finally(function () {
            //        $ionicLoading.hide();
            //    });
            //});
        }

        function getSlide() {
            $ionicLoading.show();
            WelcomeService.getSlide({}).success(function (data) {
                vm.imgData = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.loop(true);
                $ionicLoading.hide();
            });
        }
        function getAsset(){
            $ionicLoading.show();
            WelcomeService.getAsset({}).success(function (data) {
                vm.model = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
        function timer(number){
            setTimeout(function () {
                $ionicNativeTransitions.stateGo('login', {}, {}, {
                    "type": "slide",
                    "direction": "down"
                });
            },number);
        }

    }
})();