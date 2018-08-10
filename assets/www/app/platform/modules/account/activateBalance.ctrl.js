(function () {
    'use strict';

    angular.module('app').controller('ActivateBalanceCtrl', ActivateBalanceCtrl);
    ActivateBalanceCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService', '$stateParams'];
    function ActivateBalanceCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.model = {
            subAccountTypeList: $rootScope.userInfo.subAccountTypeList,
            price: "请选择",
            productChoose:"请选择"
        };
        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });
        vm.priceList = {};
        vm.productChooseList = '';
        vm.input = {
            toUsername: $stateParams.username,
            money: null,
            payPassword: '',
            activeBalanceSessionToken: void 0
        };
        vm.requestData = {};
        vm.checkCodeArr = [];//获取 checkCodeStrs
        vm.getActiveBalanceInfo = getActiveBalanceInfo;
        vm.priceChanged = priceChanged;
        vm.productChoose = productChoose;
        vm.confirm = confirm;
        vm.moneyChanged = moneyChanged;
        $scope.visible = false;

        vm.disabled = true;

        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }

        function moneyChanged() {
            if (vm.input.money != null && vm.model.price){
                vm.disabled = false;
            }else {
                vm.disabled = true;
            }
        }
        
        getActiveBalanceInfo();
        getTradesHtml();
        function getTradesHtml() {
            AccountService.getTrades(1, 20, {biz: 1}
            ).success(function (data) {
                vm.productChooseList = data.list;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function priceChanged(payTpyeId) {
            if (vm.model.price > 0 ) {
                vm.disabled = false;
            } else {
                vm.disabled = true;
            }
            AccountService.getCheckCodeStrsByPayType(payTpyeId,vm.userId)
                .success(function (res) {
                    vm.checkCodeArr = res.checkCodeStrs;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function productChoose(productChooseVal) {
            if (vm.model.productChoose > 0 ) {
                vm.disabled = false;
            } else {
                // vm.disabled = true;
            }
        }

        function getActiveBalanceInfo() {/////获得用户余额账户钱数 ||  以及投资金额数

            $ionicLoading.show();
            //获取激活金额数
            AccountService.getAmountList(vm.userId).success(function (res) {
                vm.priceList = res.lists;
                // vm.requestData.selectName = res.name;
                vm.input.doMoney = res.amount;
                vm.model = res;
                vm.input.activeBalanceSessionToken = res.activeBalanceSessionToken;
                // vm.model.subAccountTypeList = res.subAccountTypeList.list;
                $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = vm.model.subAccountTypeList;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        vm.model.subAccountTypeText = item.text;
                        return;
                    }
                });

            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function confirm() {
            var re = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w!#$%^&*.~]{6,22}$/;
            if (vm.input.money == null && vm.model.productChoose == undefined) {
                $scope.$emit('alertWarning', '请输入购买金额或者选择配套');
                return
            } else if (vm.input.money % 10 != 0) {
                $scope.$emit('alertWarning', '购买金额为10的倍数');
                return
            } else if (vm.model.price == "null" || $.trim(vm.model.price) == '') {
                $scope.$emit('alertWarning', '请选择支付方式');
                return
            } else if (vm.input.payPassword == null || $.trim(vm.input.payPassword) == '') {
                $scope.$emit('alertWarning', '请输入交易密码');
                return
            } else if (!re.test(vm.input.payPassword)) {
                $scope.$emit('alertWarning', '交易密码格式不正确');
                return
            } else {
                var data = {
                    memberId: vm.userId,
                    InvestorId: vm.userId,
                    checkCode: vm.model.checkCode,
                    bdcheckCode: vm.model.bdcheckCode,
                    tzcheckCode: vm.model.tzcheckCode,
                    activeBalanceSessionToken: vm.input.activeBalanceSessionToken,
                    Amount: vm.input.money,
                    payPwd: vm.input.payPassword,
                    payType: vm.model.price,
                    checkCodeStrs:vm.checkCodeArr,
                    tradeType:vm.model.productChoose
                }
                AccountService.activation(data).success(function (res) {
                    if(res.code=='37007'){
                        $ionicNativeTransitions.stateGo('tab.account-payment-account-0001', {subAccountType: '0030'}, {}, {
                            "type": "slide",
                            "direction": "down"
                        });
                    }
                }).error(function (error) {
                    $scope.$emit('alertWarning', error.message);
                }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
            }
        }
    }
})();