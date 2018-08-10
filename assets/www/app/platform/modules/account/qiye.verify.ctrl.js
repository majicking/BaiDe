/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('QiYeVerifyCtrl', QiYeVerifyCtrl);
    QiYeVerifyCtrl.$inject = ['$rootScope','$scope', '$sessionStorage', '$ionicLoading', '$state', 'UserService'];
    function QiYeVerifyCtrl($rootScope,$scope, $sessionStorage, $ionicLoading, $state, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.model = {
            name:$rootScope.userInfo.name,
            idCard:$rootScope.userInfo.idCard,
            bizCredentialName:$rootScope.userInfo.bizCredentialName,
            bizLicenseNo:$rootScope.userInfo.bizLicenseNo
        }

        vm.verify = verify;
        vm.clearForm = clearForm;

        function verify() {
            if (vm.model.bizCredentialName == null
                || $.trim(vm.model.bizCredentialName) == '') {
                $scope.$emit('alertWarning', '请输入法人名');
                //$ionicPopup.alert({
                //    title: "错误",
                //    template: '<div class="text-center">请输入姓名</div>'
                //})
                return;
            }
            //if (vm.idCard == null
            //    || $.trim(vm.idCard) == '') {
            //    $scope.$emit('alertWarning', '请输入法人证件号');
            //    //$ionicPopup.alert({
            //    //    title: "错误",
            //    //    template: '<div class="text-center">请输入身份证号</div>'
            //    //})
            //    return;
            //}
            var regIdCard = new RegExp("^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$");
            if (vm.model.idCard == null
                || $.trim(vm.model.idCard) == ''
                || !regIdCard.test(vm.model.idCard)) {
                $scope.$emit('alertWarning','请输入18位身份证号码并且最后一位是数字或X');
                return;
            }
            if (vm.model.name == null
                || $.trim(vm.model.name) == '') {
                $scope.$emit('alertWarning', '请输入公司名');
                //$ionicPopup.alert({
                //    title: "错误",
                //    template: '<div class="text-center">请输入姓名</div>'
                //})
                return;
            }
            if (vm.model.bizLicenseNo == null
                || $.trim(vm.model.bizLicenseNo) == '') {
                $scope.$emit('alertWarning', '请输入营业执照号');
                //$ionicPopup.alert({
                //    title: "错误",
                //    template: '<div class="text-center">请输入姓名</div>'
                //})
                return;
            }
            $ionicLoading.show();
            UserService.verifyForQiYe(
                vm.userId,
                vm.model.name,
                vm.model.idCard,
                vm.model.bizCredentialName,
                vm.model.bizLicenseNo
            ).success(function (data) {
                vm.model = data;
                $rootScope.userInfo.name = $sessionStorage.userInfo.name = vm.model.name;
                $rootScope.userInfo.idCard = $sessionStorage.userInfo.idCard = vm.model.idCard;
                $rootScope.userInfo.bizCredentialName = $sessionStorage.userInfo.bizCredentialName = vm.model.bizCredentialName;
                $rootScope.userInfo.bizLicenseNo = $sessionStorage.userInfo.bizLicenseNo = vm.model.bizLicenseNo;
                $rootScope.userInfo.isTrustName = $sessionStorage.userInfo.isTrustName = vm.model.isTrustName;
                $ionicLoading.hide();
                $state.go('tab.account');
            }).error(function (error) {
                $ionicLoading.hide();
            });
        }

        function clearForm() {
            vm.model.name = '';
            vm.model.idCard = '';
            vm.model.bizCredentialName = '';
            vm.model.bizLicenseNo = '';
        }
    }
})();