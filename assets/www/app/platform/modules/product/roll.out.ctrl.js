(function () {
    'use strict';

    angular.module('app').controller('ProductRollOutCtrl', ProductRollOutCtrl);
    ProductRollOutCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$ionicLoading', '$ionicNativeTransitions', 'ProductService', '$stateParams'];

    function ProductRollOutCtrl($rootScope, $sessionStorage, $scope, $ionicLoading, $ionicNativeTransitions, ProductService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.tradeType = $stateParams.tradeType;
        vm.ComeUrl = $stateParams.ComeUrl;
        vm.model = {
            subAccountTypeList : $rootScope.userInfo.subAccountTypeList
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeStyle = item.text;
                return;
            }
        });

        vm.input = {
            money: null,
            payPassword: '',
            productSessionToken: void 0
        };

        vm.disabled = true;

        vm.moneyChanged = moneyChanged;
        vm.confirm = confirm;
        vm.allEntry = allEntry;
        vm.goBackExt = goBackExt;
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        };

        function goBackExt() {
            $ionicNativeTransitions.stateGo(vm.ComeUrl, {
                subAccountType: vm.subAccountType
            }, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        getRollOutInfo();

        function getRollOutInfo() {
            $ionicLoading.show();
            ProductService.exchangeInfo(
                vm.userId,
                vm.subAccountType
            ).success(function (data) {
                vm.model = data;
                vm.model.subAccountTypeList = data.subAccountTypeList.list;
                $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = vm.model.subAccountTypeList;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        vm.model.subAccountTypeStyle = item.text;
                        return;
                    }
                });

                vm.model.checkCode = data.subAccountTypeText.split(':')[4];
                vm.model.amount = parseFloat(data.subAccountTypeText.split(':')[3].replace(/\,/g, ''));
                vm.input.productSessionToken = data.productSessionToken;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

        function moneyChanged() {
            var re = /^\d+\.?\d{0,2}$/;
            if (!re.test(vm.input.money)) {
                vm.disabled = true;
            } else {
                vm.disabled = vm.input.money <= 0;
            }
        }

        function allEntry() {
            if (vm.model.limit != null
                && vm.model.limit != 0
                && vm.input.money < vm.model.limit) {
                vm.input.money = parseInt(parseInt(vm.model.amount) / parseInt(vm.model.limit)) * parseInt(vm.model.limit);
            }
            //vm.input.money = parseInt(vm.model.amount);
            if (vm.input.money <= 0
                || (vm.model.limit != null
                && vm.model.limit != 0
                && vm.input.money < vm.model.limit)) {
                vm.input.money = '';
                $scope.$emit('alertWarning', '数量不足');
            }
            moneyChanged();
        }

        function confirm() {
            if (vm.model.amount < vm.input.money) {
                $scope.$emit('alertWarning', '转出数量超限');
            } else if (vm.model.limit != null
                    && vm.model.limit != 0
                    && vm.input.money < vm.model.limit) {
                $scope.$emit('alertWarning', '兑换数量低于最低额');
            } else if (vm.input.money % parseInt(vm.model.limit) !== 0) {
                $scope.$emit('alertWarning', '额度必须是' + parseInt(vm.model.limit) + '的整数倍');
            }else if(vm.input.money <= 0){
                $scope.$emit('alertWarning', '转出数量过低');
            } else if (vm.input.payPassword == null
                || $.trim(vm.input.payPassword) === '') {
                $scope.$emit('alertWarning', '请输入交易密码');
            } else {
                $ionicLoading.show();
                vm.input.checkCode = vm.model.checkCode;
                vm.input.userId = vm.userId;
                vm.input.tradeType = vm.tradeType;
                vm.input.subAccountType = vm.subAccountType;
                if(vm.subAccountType == '0031'){
                    vm.input.market = vm.model.market;
                }
                ProductService.rollOut(
                    vm.input
                ).success(function (data) {
                    $ionicNativeTransitions.stateGo('tab.account-exchange-result', {
                        id: data,
                        subAccountType: vm.subAccountType,
                        back: 'account'
                    }, {}, {
                        "type": "slide",
                        "direction": "right"
                    });
                }).error(function (error) {
                }).finally(function () {
                    $ionicLoading.hide();
                })
            }
        }
    }

    function sub(num1, num2) {
        var r1, r2, m, n;
        try {
            r1 = num1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = num2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = (r1 >= r2) ? r1 : r2;
        return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
    }
})();