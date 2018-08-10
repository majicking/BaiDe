(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('MoviesCtrl', MoviesCtrl);

    MoviesCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$localStorage', '$ionicPopup', '$ionicLoading', 'AccountService', '$stateParams'];

    function MoviesCtrl($rootScope, $sessionStorage, $scope, $localStorage, $ionicPopup, $ionicLoading, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.tempAccountAll = 0;
        vm.moviesData = '';
        vm.model = {
            cashAmount: '0'
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
        }

        vm.build = build;
        vm.getAccountInfo = getAccountInfo;
        vm.doRefresh = doRefresh;

        getAccountInfo();

        function build() {
            $scope.$emit('alertWarning', '功能开发中，敬请期待');
        }

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

        //可见/不可见
        /* function display() {
         vm.flag = JSON.parse(localStorage.getItem(vm.userId + vm.subAccountType));
         if (vm.flag) {
         localStorage.setItem(vm.userId + vm.subAccountType, JSON.stringify(false));
         vm.flag = false;
         } else {
         localStorage.setItem(vm.userId + vm.subAccountType, JSON.stringify(true));
         vm.flag = true;
         }
         }*/
    }
})();