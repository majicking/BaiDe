(function () {
    'use strict';

    angular.module('app').controller('ProductRollInCtrl', ProductRollInCtrl);
    ProductRollInCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$ionicLoading', '$ionicNativeTransitions', 'ProductService', '$stateParams', '$state'];

    function ProductRollInCtrl($rootScope, $sessionStorage, $scope, $ionicLoading, $ionicNativeTransitions, ProductService, $stateParams, $state) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.tradeType = $stateParams.tradeType;
        vm.subAccountType = $stateParams.subAccountType;
        //vm.diurnalPower = $stateParams.diurnalPower;
        vm.productType = '';
        vm.toState = $state.current.name;

        vm.model = {
            subAccountTypeList : $rootScope.userInfo.subAccountTypeList
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeStyle = item.text;
                return;
            }
        });

        vm.rollwelcomeParameterData = {};
        vm.input = {
            money: null,
            payPassword: '',
            productSessionToken: void 0
        };
        vm.disabled = true;
        vm.moneyChanged = moneyChanged;
        vm.confirm = confirm;
        vm.allEntry = allEntry;
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        };

        productTpye();
        function productTpye(){
            if(vm.tradeType == '01'){
                return vm.productType = '临时节点';
            }else{
                return vm.productType = '固定节点';
            }
        }

        rollwelcomeParameter();
        function rollwelcomeParameter() {
            ProductService.rollwelcomeParameter(
                vm.tradeType
            ).success(function (data) {
                vm.rollwelcomeParameterData = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        getRollInInfo();
        function getRollInInfo() {
            $ionicLoading.show();
            ProductService.getRollInfo(
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
            //var m = multiples();
            if (vm.rollwelcomeParameterData.split(':')[2] != ''
                && vm.rollwelcomeParameterData.split(':')[2] != '0'
                && vm.input.money < parseInt(vm.rollwelcomeParameterData.split(':')[2])) {
                vm.input.money = parseInt(parseInt(vm.model.amount) / parseInt(vm.rollwelcomeParameterData.split(':')[2])) * parseInt(vm.rollwelcomeParameterData.split(':')[2]);
            }

            //vm.input.money = parseFloat(vm.model.amount);
            if (vm.input.money <= 0
                || (vm.rollwelcomeParameterData.split(':')[2] != ''
                && vm.rollwelcomeParameterData.split(':')[2] != '0'
                && vm.input.money < parseInt(vm.rollwelcomeParameterData.split(':')[2]))) {
                vm.input.money = '';
                $scope.$emit('alertWarning', '数量不足');
            }
            moneyChanged();
        }

        function confirm() {
            //var m = multiples();
            if (vm.model.amount < vm.input.money) {
                $scope.$emit('alertWarning', '存入数量超限');
            } else if (vm.rollwelcomeParameterData.split(':')[2] != ''
                    && vm.rollwelcomeParameterData.split(':')[2] != '0'
                    && vm.input.money < parseInt(vm.rollwelcomeParameterData.split(':')[2])) {
                $scope.$emit('alertWarning', '存入数量低于最低额');
            } else if (vm.input.money % parseInt(vm.rollwelcomeParameterData.split(':')[2]) !== 0) {
                $scope.$emit('alertWarning', '存入数量必须是' + parseInt(vm.rollwelcomeParameterData.split(':')[2]) + '的整数倍');
            }else if(vm.input.money <= 0){
                $scope.$emit('alertWarning', '存入数量过低');
            } else if (vm.input.payPassword == null
                || $.trim(vm.input.payPassword) === '') {
                $scope.$emit('alertWarning', '请输入交易密码');
            } else {
                $ionicLoading.show();
                vm.input.checkCode = vm.model.checkCode;
                vm.input.userId = vm.userId;
                vm.input.tradeType = vm.tradeType;

                ProductService.rolIn(
                    vm.input
                ).success(function (data) {
                    var toState = '';
                    if (vm.toState == 'tab.product-roll-in-account') {
                        toState = 'tab.product-result-account';
                    } else if (vm.toState == 'tab.product-roll-in') {
                        toState = 'tab.product-result'
                    }

                    $ionicNativeTransitions.stateGo(toState, {
                        id: data,
                        subAccountType: vm.subAccountType,
                        pattern: 1,
                        back: 'account',
                        fromState: vm.toState
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
        function multiples() {
            if (vm.tradeType === "01") {
                return 50;
            }
            if (vm.tradeType === "02") {
                return 100;
            }
            if (vm.tradeType === "03") {
                return 100;
            }
            if (vm.tradeType === "04") {
                return 100;
            }
            if (vm.tradeType === "05") {
                return 100;
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