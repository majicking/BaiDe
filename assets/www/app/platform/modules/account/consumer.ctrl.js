(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ConsumerCtrl', ConsumerCtrl);

    ConsumerCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$localStorage', '$ionicPopup', '$ionicLoading', 'AccountService', '$stateParams'];

    function ConsumerCtrl($rootScope, $sessionStorage, $scope, $localStorage, $ionicPopup, $ionicLoading, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.tempAccountAll = 0;
        vm.model = {
            ydayAmount: '0',
            totalAmount: '0',
            cashAmount: '0',
            amount: '0'
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.flag = JSON.parse(localStorage.getItem(vm.userId + vm.subAccountType));
        if (vm.flag == null) {
            vm.flag = true;
            localStorage.setItem(vm.userId + vm.subAccountType, JSON.stringify(vm.flag));
        }

        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        };

        vm.doRefresh = doRefresh;
        vm.build = build;
        vm.display = display;
        vm.getAccountInfo = getAccountInfo;

        getAccountInfo();

        function getAccountInfo() {
            $ionicLoading.show();
            AccountService.getAccount1({
                userId: vm.userId,
                subAccountType: vm.subAccountType
            }).success(function (result) {
                vm.model = result;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        item.text = vm.model.subAccountTypeText;
                        return;
                    }
                });
                $sessionStorage.userInfo.subAccountTypeList = $rootScope.userInfo.subAccountTypeList;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function doRefresh() {
            getAccountInfo();
            $scope.$broadcast('scroll.refreshComplete');
        }

        function build() {
            $scope.$emit('alertWarning', '功能开发中，敬请期待');
        }

        //可见/不可见
        function display() {
            vm.flag = JSON.parse(localStorage.getItem(vm.userId + vm.subAccountType));
            if (vm.flag) {
                localStorage.setItem(vm.userId + vm.subAccountType, JSON.stringify(false));
                vm.flag = false;
            } else {
                localStorage.setItem(vm.userId + vm.subAccountType, JSON.stringify(true));
                vm.flag = true;
            }
        }
    }
})();