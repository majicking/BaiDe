/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('PaymentCtrl', PaymentCtrl);
    PaymentCtrl.$inject = ['$ionicNativeTransitions','$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$state', 'UserService'];
    function PaymentCtrl($ionicNativeTransitions,$rootScope, $scope, $sessionStorage, $ionicLoading, $state, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.paymentPw = '';
        vm.rePassword = '';

        vm.confirm = confirm;
        vm.isFocusPw=isFocusPw;
        vm.isFocusRePw=isFocusRePw;
        vm.isBlurPw=isBlurPw;
        vm.isBlurRePw=isBlurRePw;
        function isFocusPw(){
            vm.paymentTextPw=null;
        }
        function isFocusRePw(){
            vm.paymentTextRePw = null;
        }
        function isBlurPw() {
            vm.paymentTextPw = '6-22位至少含有数字/字母/符号中的2种';
        }
        function isBlurRePw() {
            vm.paymentTextRePw = '确认交易密码';
        }
        $scope.$on('$ionicView.enter', function () {
            // 显示 tabs
            $rootScope.hideTabs = false;
        });
        function confirm() {
            var re = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w!#$%^&*.~]{6,22}$/;
            if (vm.paymentPw == null
                || $.trim(vm.paymentPw) == '') {
                $scope.$emit('alertWarning', '请输入新密码');
                return;
            }
            if (!re.test(vm.paymentPw)) {
                $scope.$emit('alertWarning', '新密码格式不正确');
                return;
            }
            if (vm.rePassword == null
                || $.trim(vm.rePassword) == '') {
                $scope.$emit('alertWarning', '请输入再确认密码');
                return;
            }
            if (vm.paymentPw != vm.rePassword) {
                $scope.$emit('alertWarning', '两次输入的密码不一致');
                return;
            }
            $ionicLoading.show();
            UserService.addPaymentPw(
                vm.userId,
                vm.paymentPw
            ).success(function (data) {
                $rootScope.userInfo.isPayment = $sessionStorage.userInfo.isPayment = 1;
                $ionicLoading.hide();
                // $state.go('');
                $ionicNativeTransitions.stateGo('authenticationBankAdd', {ComeUrl:'payment'}, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            }).error(function (error) {
                $ionicLoading.hide();
            });
        }
    }
})();