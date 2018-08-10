/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('QrcodeCtrl', QrcodeCtrl);

    QrcodeCtrl.$inject = ['$rootScope','$scope', '$sessionStorage', '$state', '$ionicLoading', 'AccountService','$cordovaScanning'];
    function QrcodeCtrl($rootScope,$scope, $sessionStorage, $state, $ionicLoading, AccountService,$cordovaScanning) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.code = '';

        vm.model = {
            username:$rootScope.userInfo.username,
            imgAddr:$rootScope.userInfo.imgAddr,
            code:$rootScope.userInfo.code
        };

        vm.logout = logout;
        vm.getCode = getCode;
        vm.copy = copy;
        vm.getCode();
        function copy() {
            // $('#copy').attr('data-clipboard-text', vm.code);
            // var clipboard = new ClipboardJS('#copy');;
            // clipboard.on('success', function (e) {
            //     $scope.$emit('alertWarning', '复制成功');
            // });
            // clipboard.on('error', function (e) {
            //     $scope.$emit('alertWarning', '复制失败');
            // });
            $cordovaScanning.commont("copy", vm.code).then(function (ssuc) {
                $scope.$emit('alertWarning', ssuc);
            },function (error) {
                $scope.$emit('alertWarning', error);
            });
        }
        function getCode() {
            $ionicLoading.show();
            AccountService.getCode(
                vm.userId
            ).success(function (data) {
                vm.model = data;
                vm.code = data.code;
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