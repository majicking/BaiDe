/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ReferralCtrl', ReferralCtrl);

    ReferralCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicNativeTransitions','$ionicPopup', 'UserService'];
    function ReferralCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicNativeTransitions, $ionicPopup, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.referralCode = '';
        vm.password = '';
        //vm.disabled = true;

        //vm.referralChanged = referralChanged;
        vm.addReferralCode = addReferralCode;

        //function referralChanged(){
        //    var re = /^[A-Za-z0-9]+$/;
        //    if (!re.test(vm.referralCode)) {
        //        vm.disabled = true;
        //    } else {
        //        vm.disabled = false;
        //    }
        //}

        function addReferralCode() {
            var re = /^[A-Za-z0-9]+$/;
            if (vm.referralCode == null
                || $.trim(vm.referralCode) == '') {
                $scope.$emit('alertWarning', '请输入邀请码');
                return;
            } else if (!re.test(vm.referralCode)) {
                $scope.$emit('alertWarning', '请填写正确邀请码');
                return;
            } else if (vm.password == null
                || $.trim(vm.password) == '') {
                $scope.$emit('alertWarning', '请输入登录密码');
                return;
            } else {
                UserService.validateReferralCode(
                    vm.referralCode,
                    vm.userId
                ).success(function (message) {
                    if(message.code==1){
                        var confirmPopup = $ionicPopup.confirm({
                            title: '确认',
                            template: '<div class="text-center">您的推荐人是' + message.data + '?</div>',
                            cancelText: '否',
                            okText: '是'
                        });
                        confirmPopup.then(function(res) {
                            if(res) {
                                $ionicLoading.show();
                                UserService.addReferralCode(
                                    vm.userId,
                                    vm.referralCode,
                                    vm.password
                                ).success(function (data) {
                                    $rootScope.userInfo.referralName = $sessionStorage.userInfo.referralName = data;
                                    $ionicNativeTransitions.stateGo('tab.manage', {}, {}, {
                                        "type": "slide",
                                        "direction": "right"
                                    });
                                }).error(function (error) {
                                }).finally(function () {
                                    $ionicLoading.hide();
                                })
                            }
                        });
                    }else{
                        $scope.$emit('alertWarning', message.message);
                    }
                }).error(function (error) {
                }).finally (function(){
                    $ionicLoading.hide();
                });

            }
        }
    }
})();