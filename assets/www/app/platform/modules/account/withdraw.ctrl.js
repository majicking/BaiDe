(function () {
    'use strict';

    angular.module('app').controller('WithdrawCtrl', WithdrawCtrl);
    WithdrawCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$ionicLoading', '$ionicNativeTransitions', 'AccountService', '$stateParams'];
    function WithdrawCtrl($rootScope, $sessionStorage, $scope, $ionicLoading, $ionicNativeTransitions, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;

        vm.model = {
            subAccountTypeList : $rootScope.userInfo.subAccountTypeList
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.input = {
            money : null,
            payPassword : '',
            withdrawSessionToken : void 0
        };

        vm.disabled = false;

        vm.moneyChanged = moneyChanged;
        vm.subAccountChanged = subAccountChanged;
        vm.confirm = confirm;
        vm.allEntry = allEntry;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }
        allEntry(1);
        getWithdrawInfo();

        function getWithdrawInfo(){
            $ionicLoading.show();
            AccountService.getWithdrawInfo(
                vm.userId,
                vm.subAccountType,
                '0027'
            ).success(function (data) {
                vm.model = data;
                vm.model.subAccountTypeTextList = data.subAccountTypeTextList.list;
                vm.model.subAccountTypeList = data.subAccountTypeList.list;
                $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = vm.model.subAccountTypeList;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        vm.model.subAccountTypeText = item.text;
                        return;
                    }
                });
                vm.input.withdrawSessionToken = data.withdrawSessionToken;

                subAccountChanged('0031');
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

        function moneyChanged(){
            var re = /^\d+\.?\d{0,2}$/;
            if(!re.test(vm.input.money)){
                vm.disabled = true;
            }else {
                if ( vm.input.payPassword == null || $.trim(vm.input.payPassword) == '' || (vm.input.money == null || $.trim(vm.input.money) == '') ) {
                    vm.disabled = true;
                } else {
                    vm.disabled = false;
                }
            }
        }

        function allEntry(){
            vm.input.money = parseInt(vm.model.amount / 100) * 100;
            if (vm.input.money <= 0
                || (vm.model.withdrawLimit != null
                && vm.input.money < vm.model.withdrawLimit)) {
                vm.input.money = '';
                $scope.$emit('alertWarning', '额度不足');
            }
            moneyChanged();
        }

        function subAccountChanged(subAccountType){
            vm.input.subAccountTypeOp = subAccountType;
            angular.forEach(vm.model.subAccountTypeTextList, function (item) {
                if (item.value == subAccountType) {
                    vm.model.checkCode = item.text.split(':')[4];
                    vm.model.amount = parseInt(item.text.split(':')[3].replace(/\,/g,''));
                    return;
                }
            });
        }

        function confirm(){
            if (!vm.model.withdrawType) {
                $scope.$emit('alertWarning', '此用户不能提现，详情请联系管理员');
            }else if(vm.model.amount < vm.input.money){
                $scope.$emit('alertWarning', '提现额度超限');
            }else if(vm.model.withdrawLimit != null
                && vm.input.money < vm.model.withdrawLimit){
                $scope.$emit('alertWarning', '提现额度低于最低额');
            }else if(vm.input.money%100 != 0 || vm.input.money <= 0){
                $scope.$emit('alertWarning', '提现额度必须是100的整数倍');
            }else if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else{
                $ionicLoading.show();
                vm.input.subAccountType = vm.subAccountType;
                vm.input.checkCode = vm.model.checkCode;
                vm.input.userId = vm.userId;
                vm.input.bankCardId = vm.model.bankCard.id;
                AccountService.withdraw(
                    vm.input
                ).success(function (data) {
                    $ionicNativeTransitions.stateGo('tab.account-withdraw-result', {
                        id:data,
                        subAccountType:vm.subAccountType,
                        back:'account'
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

    function sub(num1,num2){
        var r1,r2, m,n;
        try{
            r1 = num1.toString().split('.')[1].length;
        }catch(e){
            r1 = 0;
        }
        try{
            r2=num2.toString().split(".")[1].length;
        }catch(e){
            r2=0;
        }
        m=Math.pow(10,Math.max(r1,r2));
        n=(r1>=r2)?r1:r2;
        return (Math.round(num1*m-num2*m)/m).toFixed(n);
    }
})();