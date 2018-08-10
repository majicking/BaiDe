(function () {
    'use strict';

    angular.module('app').controller('TransferCtrl', TransferCtrl);
    TransferCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService', 'UserService','$stateParams'];
    function TransferCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService, UserService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.ComeUrl = $stateParams.ComeUrl;
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
            toUsername : $stateParams.username,
            money : null,
            payPassword : '',
            transferSessionToken : void 0
        };

        vm.transferType = '0017';

        vm.disabled = false;

        vm.moneyChanged = moneyChanged;
        vm.subAccountChanged = subAccountChanged;
        vm.confirm = confirm;
        vm.allEntry = allEntry;
        vm.goBack = goBack;
        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        allEntry(1);
        getTransferInfo();

        function getTransferInfo(){
            $ionicLoading.show();
            AccountService.getTransferInfo(
                vm.userId,
                vm.subAccountType,
                vm.transferType
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
                vm.input.transferSessionToken = data.transferSessionToken;

                if (vm.transferType != vm.subAccountType) {
                    subAccountChanged(vm.subAccountType);
                } else {
                    subAccountChanged('0031');
                }
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

        function moneyChanged(){
            var doubleByte = vm.input.toUsername != undefined ? vm.input.toUsername.replace(/[^\x00-\xff]/g, "01").length : '';
            var re = /^\d+\.?\d{0,2}$/;
            if(!re.test(vm.input.money) || doubleByte <= 0 ){
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
            var numParseInt = parseInt(vm.model.amount/100);
            vm.input.money = numParseInt*100
            if (vm.input.money <= 0
                || (vm.model.transferLimit != null
                && vm.input.money < vm.model.transferLimit)) {
                vm.input.money = '';
                $scope.$emit('alertWarning', '数量不足');
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
            if (!vm.model.transferType) {
                $scope.$emit('alertWarning', '此用户不能转账，详情请联系管理员');
            }else if(vm.input.toUsername == null
                || $.trim(vm.input.toUsername) == ''){
                $scope.$emit('alertWarning', '请输入转账账户');
            }else if(vm.model.transferLimit != null
                && vm.input.money < vm.model.transferLimit){
                $scope.$emit('alertWarning', '转出数量低于最低额');
            }else if(vm.model.amount < vm.input.money){
                $scope.$emit('alertWarning', '转账数量超限');
            }else if(vm.input.money%100 != 0 || vm.input.money <= 0){
                $scope.$emit('alertWarning', '转账额度必须是100的整数倍');
            }else if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else if(vm.input.toUsername == vm.model.username){
                $scope.$emit('alertWarning', '不能转账给自己，请确认转出用户');
            }else{
                $ionicLoading.show();
                UserService.validateUsername(
                    vm.input.toUsername
                ).success(function (message) {
                    if(message.code==1){
                        var confirmPopup = $ionicPopup.confirm({
                            title: '确认',
                            template: '<div class="text-center">您的转出对象是【' + message.data + '】,确认转出么？</div>',
                            cancelText: '否',
                            okText: '是'
                        });
                        confirmPopup.then(function(res) {
                            if(res) {
                                $ionicLoading.show();
                                vm.input.subAccountType = vm.subAccountType;
                                vm.input.userId = vm.userId;
                                vm.input.checkCode = vm.model.checkCode;
                                AccountService.transfer(
                                    vm.input
                                ).success(function (data) {
                                    $ionicNativeTransitions.stateGo('tab.account-transfer-result', {
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

        function goBack() {
            $ionicNativeTransitions.stateGo(vm.ComeUrl, {subAccountType: vm.subAccountType}, {}, {
                "type": "slide",
                "direction": "down"
            });
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