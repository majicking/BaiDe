/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BindingCtrl', BindingCtrl);

    BindingCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicNativeTransitions', '$stateParams', '$ionicLoading', 'UserService'];
    function BindingCtrl($rootScope, $scope, $sessionStorage, $ionicNativeTransitions, $stateParams, $ionicLoading, UserService) {
        var vm = this;
        vm.showPage = false;
        vm.showError = false;
        vm.username = '';
        vm.password = '';
        vm.code = $stateParams.code;
        vm.wechatInfo = {};
        vm.bindAccount = bindAccount;

        vm.close = close;

        getWechatInfo();

        function close(){
            if (typeof WeixinJSBridge != "undefined"){
                WeixinJSBridge.call('closeWindow')
            }
        }

        function getWechatInfo(){
            $ionicLoading.show();
            UserService.getWechatInfo(
                vm.code
            ).success(function (data) {
                vm.wechatInfo = data;
                vm.showPage = true;
            }).error(function(error){
                vm.showError = true;
            }).finally(function(error){
                $ionicLoading.hide();
            });
        }

        function bindAccount(){
            if (vm.username == null || $.trim(vm.username) == '') {
                $scope.$emit('alertWarning', '请输入用户名');
                return;
            }
            if (vm.password == null || $.trim(vm.password) == '') {
                $scope.$emit('alertWarning', '请输入密码');
                return;
            }
            $ionicLoading.show();
            UserService.bindAccount(
                vm.username,
                vm.password,
                vm.wechatInfo.openId
            ).success(function (data) {
                $rootScope.isLogged = $sessionStorage.isLogged = true;
                $rootScope.userInfo = $sessionStorage.userInfo = data;
                $rootScope.token = $sessionStorage.token = data.token;
                $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            }).error(function(error){
            }).finally(function(error){
                $ionicLoading.hide();
            });
        }
    }
})();