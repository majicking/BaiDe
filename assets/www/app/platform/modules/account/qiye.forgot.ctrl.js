/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('QiYeForgotCtrl', QiYeForgotCtrl);

    QiYeForgotCtrl.$inject = ['$rootScope', '$scope','$interval', '$ionicLoading', '$state', 'UserService'];
    function QiYeForgotCtrl($rootScope, $scope,$interval, $ionicLoading, $state, UserService) {
        var vm = this;
        vm.password = '';
        vm.phone = '';
        vm.code = '';
        vm.captcha = '';
        vm.reCaptcha = '';
        vm.captchaBtn = {
            disabled: false,
            label: '获取动态码'
        };

        getCode();

        vm.forgot = forgot;
        vm.clearForm = clearForm;
        vm.getCaptcha = getCaptcha;
        vm.getCode = getCode;

        function getCode(){
            vm.codeUrl = 'http://www.baidecf.com/api/authcode/index?t='+new Date().getTime();
        }

        function forgot() {
            var re = null;
            if (vm.username == null
                || $.trim(vm.username) == '') {
                $scope.$emit('alertWarning', '请输入用户名');
                return;
            }
            if (vm.phone == null
                || $.trim(vm.phone) == '') {
                $scope.$emit('alertWarning', '请输入手机号');
                return;
            }
            re = /^1\d{10}$/;
            if (!re.test(vm.phone)) {
                $scope.$emit('alertWarning', '手机号格式不正确');
                return;
            }
            if (vm.captcha == null
                || $.trim(vm.captcha) == '') {
                $scope.$emit('alertWarning', '请输动态码');
                return;
            }
            if (vm.password == null
                || $.trim(vm.password) == '') {
                $scope.$emit('alertWarning', '请输入密码');
                return;
            }
            re = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
            if (!re.test(vm.password)) {
                $scope.$emit('alertWarning', '密码格式不正确');
                return;
            }
            $ionicLoading.show();
            UserService.forgotForQiYe(
                vm.username,
                vm.password,
                vm.phone,
                vm.captcha,
                vm.reCaptcha
            ).success(function (data) {
                vm.clearForm();
                $ionicLoading.hide();
                $state.go('qiye-login');
            }).error(function (error) {
                $ionicLoading.hide();
            });
        }

        var timePromise;
        var second = 180;

        function getCaptcha(verifyPhone) {
            if (vm.code == null || $.trim(vm.code) == '') {
                $scope.$emit('alertWarning', '请输入验证码');
                return;
            }
            var re = null;
            if (vm.phone == null || $.trim(vm.phone) == '') {
                $scope.$emit('alertWarning', '请输入手机号');
                return;
            }
            re = /^1\d{10}$/;
            if (!re.test(vm.phone)) {
                $scope.$emit('alertWarning', '手机号格式不正确');
                return;
            }
            UserService.getCaptcha(vm.code,vm.phone, verifyPhone).success(function (data) {
                vm.reCaptcha = data;
                changeCaptchaButton();
                timePromise = $interval(function () {
                    if (second == 0) {
                        initCaptchaButton(timePromise);
                    } else {
                        changeCaptchaButton();
                    }
                }, 1000);
            });
        }

        function clearForm() {
            vm.password = '';
            vm.code = '';
            vm.phone = '';
            vm.captcha = '';
            vm.reCaptcha = '';
        }

        function initCaptchaButton() {
            vm.captchaBtn.disabled = false;
            vm.captchaBtn.label = '获取动态码';
            second = 180;
            $interval.cancel(timePromise);
        }

        function changeCaptchaButton() {
            vm.captchaBtn.disabled = true;
            vm.captchaBtn.label = "重新发送(" + second + ")";
            second--;
        }
    }
})();