/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('RePaymentCtrl', RePaymentCtrl);

    RePaymentCtrl.$inject = ['$rootScope', '$scope','$interval', '$ionicLoading', '$ionicNativeTransitions', 'UserService'];
    function RePaymentCtrl($rootScope, $scope,$interval, $ionicLoading, $ionicNativeTransitions, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.oldPassword = '';
        vm.newPassword = '';
        vm.rePassword = '';

        vm.changePassword = changePassword;

        function changePassword() {
            var re = null;
            if (vm.oldPassword == null
                || $.trim(vm.oldPassword) == '') {
                $scope.$emit('alertWarning', '请输入旧密码');
                return;
            }
            if (vm.newPassword == null
                || $.trim(vm.newPassword) == '') {
                $scope.$emit('alertWarning', '请输入新密码');
                return;
            }
            re = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w!#$%^&*.~]{6,22}$/;
            if (!re.test(vm.newPassword)) {
                $scope.$emit('alertWarning', '新密码格式不正确');
                return;
            }
            if (vm.rePassword == null
                || $.trim(vm.rePassword) == '') {
                $scope.$emit('alertWarning', '请输入再确认密码');
                return;
            }
            if (vm.newPassword != vm.rePassword) {
                $scope.$emit('alertWarning', '两次输入的密码不一致');
                return;
            }
            $ionicLoading.show();
            UserService.changePayment(
                vm.userId,
                vm.oldPassword,
                vm.newPassword
            ).success(function (data) {
                $scope.$emit('alertWarning', '密码修改成功');
                $ionicNativeTransitions.stateGo('tab.manage', {}, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }
    }
})();