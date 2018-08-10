(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('InvestmentAccountCtrl', InvestmentAccountCtrl);

    InvestmentAccountCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$localStorage', '$ionicPopup', '$ionicLoading', 'AccountService', '$stateParams', '$ionicNativeTransitions'];
    function InvestmentAccountCtrl($rootScope, $sessionStorage, $scope, $localStorage, $ionicPopup, $ionicLoading, AccountService, $stateParams, $ionicNativeTransitions) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;

        vm.model = {
            ydayAmount: '0',
            totalAmount: '0',
            cashAmount: '0',
            amount: '0',
            totalDirectAmount: '0',
            totalManageAmount: '0'
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

        vm.doRefresh = doRefresh;
        vm.build = build;
        vm.getAccountInfo = getAccountInfo;
        vm.display = display;
        vm.isGoNativeBackParams = isGoNativeBackParams;
        vm.goConversion = goConversion;
        vm.getAccountInfo();

        function goConversion() {
            if(vm.subAccountType=="0031"){
                $ionicNativeTransitions.stateGo('tab.product-roll-out', {
                    subAccountType: vm.subAccountType,
                    ComeUrl: "tab.account-investmentAccount"
                }, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            }//else if(vm.subAccountType=="0031"){
            //     $ionicNativeTransitions.stateGo('tab.product-roll-out', {
            //         subAccountType: vm.subAccountType,
            //         ComeUrl: "tab.account-goldCoin"
            //     }, {}, {
            //         "type": "slide",
            //         "direction": "right"
            //     });
            // }
        }

        function getAccountInfo() {/////获得用户余额账户钱数
            $ionicLoading.show();
            AccountService.getAccount1({
                userId: vm.userId,
                subAccountType: vm.subAccountType
            }).success(function (data) {
                vm.model = data;
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

        function isGoNativeBackParams(e, subAccountType) {
            $ionicNativeTransitions.stateGo(e, {subAccountType: subAccountType}, {}, {
                "type": "slide",
                "direction": "down"
            });
            /*f (vm.model.isActivity == 1) {//0 未激活 1 已激活
                $ionicNativeTransitions.stateGo(e, {subAccountType: subAccountType}, {}, {
                    "type": "slide",
                    "direction": "down"
                });
            } else {
                $scope.$emit('alertWarning', '投资后操作');
            }*/
        }

        function doRefresh() {////下拉刷新
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