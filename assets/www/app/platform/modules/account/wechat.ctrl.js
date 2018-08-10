/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('WechatCtrl', WechatCtrl);

    WechatCtrl.$inject = ['$rootScope', '$scope', '$state', '$sessionStorage', '$stateParams', '$timeout', 'UserService'];
    function WechatCtrl($rootScope, $scope, $state, $sessionStorage, $stateParams, $timeout, UserService) {
        var vm = this;
        vm.showLoading = true;
        vm.code = $stateParams.code;
        vm.state = $stateParams.state;

        vm.close = close;

        loginForWechat();

        function close() {
            if (typeof WeixinJSBridge != "undefined") {
                WeixinJSBridge.call('closeWindow')
            }
        }

        function loginForWechat() {
            UserService.loginForWechat(
                vm.code
            ).success(function (data) {
                if (null != data) {
                    $rootScope.isLogged = $sessionStorage.isLogged = true;
                    $rootScope.userInfo = $sessionStorage.userInfo = data;
                    $rootScope.token = $sessionStorage.token = data.token;
                    if (vm.state == 'increase') {
                        $state.go(vm.state, {qrcode: $stateParams.qrcode});
                    } else {
                        $state.go(vm.state);
                    }
                } else {
                    $scope.$emit('alertWarning', '亲，您还没有还没绑定账户！请在微信端绑定，或直接登录。');
                    $state.go("login");
                }
            }).error(function (error) {
                vm.showLoading = false;
            }).finally(function (error) {
            });
        }
    }
})();