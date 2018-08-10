/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('QrcodeCtrl', QrcodeCtrl);

    QrcodeCtrl.$inject = ['$rootScope', '$sessionStorage', '$state', '$ionicLoading', '$ionicNativeTransitions','AccountService'];
    function QrcodeCtrl($rootScope, $sessionStorage, $state, $ionicLoading,$ionicNativeTransitions, AccountService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.model = {
            username:$rootScope.userInfo.username,
            imgAddr:$rootScope.userInfo.imgAddr,
            code:$rootScope.userInfo.code
        };

        vm.logout = logout;
        vm.getCode = getCode;
        vm.getCode();

        function getCode() {
            $ionicLoading.show();
            AccountService.getCode(
                vm.userId
            ).success(function (data) {
                vm.model = data;
                $rootScope.userInfo.username = $sessionStorage.userInfo.username = vm.model.username;
                $rootScope.userInfo.imgAddr = $sessionStorage.userInfo.imgAddr = vm.model.imgAddr;
                $rootScope.userInfo.code = $sessionStorage.userInfo.code = vm.model.code;
                $ionicLoading.hide();
            }).error(function (error) {
                $ionicLoading.hide();
            });
        }

        function logout() {
            if ($sessionStorage.isLogged) {
                $rootScope.isLogged = $sessionStorage.isLogged = false;
                delete $sessionStorage.userInfo;
                $rootScope.userInfo = {};
                delete $sessionStorage.token;
                $rootScope.token = null;
            }
            if (typeof WeixinJSBridge != "undefined") {
                WeixinJSBridge.call('closeWindow')
            } else {
                $state.go('login');
            }
        }
    }
})();