/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('MobileCtrl', MobileCtrl);

    MobileCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$interval', '$ionicLoading', '$ionicNativeTransitions', 'UserService'];
    function MobileCtrl($rootScope, $sessionStorage, $scope, $interval, $ionicLoading, $ionicNativeTransitions, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.isMobile = $rootScope.userInfo.isMobile;

        vm.phone = '';
        vm.code = '';
        vm.captcha = '';
        vm.password = '';
        vm.reCaptcha = '';
        vm.captchaBtn = {
            disabled: false,
            label: '获取动态码'
        };

        getCode();

        vm.mobile = mobile;
        vm.clearForm = clearForm;
        vm.getCaptcha = getCaptcha;
        vm.getCode = getCode;

        function getCode(){
            vm.codeUrl = 'http://www.baidecf.com/api/authcode/index?t='+new Date().getTime();
        }

        function mobile() {
            if (vm.phone == null
                || $.trim(vm.phone) == '') {
                $scope.$emit('alertWarning', '请输入手机号');
                return;
            }
            var re = /^1\d{10}$/;
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
                $scope.$emit('alertWarning', '请输入登录密码');
                return;
            }
            $ionicLoading.show();
            UserService.mobile(
                vm.userId,
                vm.phone,
                vm.captcha,
                vm.reCaptcha,
                vm.password
            ).success(function (data) {
                $rootScope.mobile = $sessionStorage.mobile = data;
                $rootScope.isMobile = $sessionStorage.isMobile = true;
                $ionicNativeTransitions.stateGo('tab.manage', {}, {}, {
                    "type": "slide",
                    "direction": "down"
                });
            }).error(function (error) {
            }).finally (function(){
                $ionicLoading.hide();
            });
        }

        var timePromise;
        var second = 180;

        function getCaptcha(verifyPhone) {
            if (vm.code == null
                || $.trim(vm.code) == '') {
                $scope.$emit('alertWarning', '请输入验证码');
                return;
            }
            var re = null;
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
            UserService.getCaptcha(vm.code, vm.phone, verifyPhone).success(function (data) {
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