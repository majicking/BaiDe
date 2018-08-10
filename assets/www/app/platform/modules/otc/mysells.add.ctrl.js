(function () {
    'use strict';

    angular.module('app').controller('OtcMySellsAddCtrl', OtcMySellsAddCtrl);
    OtcMySellsAddCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'OtcService','OtcNbService', 'BankCardService', 'AccountService', '$stateParams'];
    function OtcMySellsAddCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, OtcService,OtcNbService, BankCardService, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.comeUrl = $stateParams.comeUrl;

        vm.model = {
            subAccountTypeList : $rootScope.userInfo.subAccountTypeList,
            consumeAccount : 0,
            bankInfo:'',
            selectBidding:''
        };
        vm.bankInfo = {};
        vm.input = {
            sellOnePrice : '',
            sellAmount : '',
            totalPrice : 0,
            bankCardId : '',
            status : '0',
            createUser: $rootScope.userInfo.userId,
            currentUser: $rootScope.userInfo.userId,
            payPassword : '',
            checkCode:'',
            subAccountType : vm.subAccountType,
            tokenOtcSell:'',
            otcType:'0',
            tradeLimit:'',
            tradeCount:0,
            otcnc:''
            //sellAccountType:'0015'
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.pageContent = {
            amountStr:'卖出数量',
            otcStr:'卖出'
        }

        vm.otcTypes = [
            {
                value: '0',
                text: '卖出'
            },
            {
                value: '1',
                text: '买入'
            }
        ];

        vm.disabled = true;

        vm.subAccountChanged = subAccountChanged;
        vm.confirm = confirm;
        vm.updateTotalPrice = updateTotalPrice;
        vm.otcTypeChanged = otcTypeChanged;
        vm.allEntry = allEntry;
        vm.selectBidding = selectBidding;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        initOtcSellAddPage();
        initBankCards();
        initConsumeAccount();

        function selectBidding() {

        }

        function otcTypeChanged(otcTypeVal){
            vm.input.otcType = otcTypeVal;
            if(vm.input.otcType == '0'){
                vm.pageContent.amountStr='卖出数量';
                vm.pageContent.otcStr = '卖出';
            }else{
                vm.pageContent.amountStr='买入数量';
                vm.pageContent.otcStr = '买入';
                vm.input.sellOnePrice = '';
            }
            vm.input.payPassword = '';
            vm.input.sellNum='';
        }

        function initOtcSellAddPage(){
            OtcService.initOtcSellModel(vm.input)
            // OtcNbService.initOtcSellModel(vm.input)
                .success(function(data){
                    vm.input.checkCode = data.checkCode;
                    vm.model.consumeAccount = data.consumeAccount;
                    var typeList = data.subAccountTypeTextList.list;
                    for ( var i = 0; i < typeList.length; i++){
                        vm.input.checkCode = typeList[i].text.split(':')[4];
                    }
                    vm.input.tokenOtcSell = data.tokenOtcSell;
                    vm.input.tradeLimit = data.tradeLimit;
                    vm.model.subAccountTypeTextList = data.subAccountTypeTextList.list;

                    $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value == vm.subAccountType) {
                            vm.model.subAccountTypeText = item.text;
                            return;
                        }
                    });
                    subAccountChanged('0031');
                }).error(function (error) {
            }).finally(function () {
            });
        }

        function initBankCards(){
            BankCardService.getBankCardList(vm.userId)
                .success(function(data){
                    angular.forEach(data, function (item) {
                        if(item.used == '1'){
                            vm.bankInfo = item;
                            vm.input.bankCardId = vm.bankInfo.id;
                        }
                    });
                }).error(function (error) {
            }).finally(function () {
            });
        }

        /**
         * 获取消费的账户信息
         */
        function initConsumeAccount(){
            AccountService.getAsset(vm.userId, '0031')
                .success(function(data){
                    vm.model.upDown = data.upDown;
                    vm.model.rate = data.rate;
                    vm.model.market = data.market;
                    vm.input.sellOnePrice = data.market;

                }).error(function (error) {
            }).finally(function () {
            });
        }

        function updateTotalPrice(){
            //计算总价,取小数后两位,不四舍五入
            var op = parseFloat(vm.input.sellOnePrice);
            var num = parseFloat(vm.input.sellAmount);
            if(!isNaN(op) && !isNaN(num)){
                vm.input.totalPrice = (op*num).toFixed(2);
                var re = /^\d+\.?\d{0,2}$/;
                if(!re.test(vm.input.totalPrice)){
                    vm.disabled = true;
                }else {
                    if (vm.input.totalPrice > 0) {
                        vm.disabled = false;
                    } else {
                        vm.disabled = true;
                    }
                }
            }else{
                vm.input.totalPrice = 0;
                vm.disabled = true;
            }
        }

        function allEntry() {
            if (vm.input.tradeLimit != null
                && vm.input.tradeLimit != 0
                && vm.input.sellAmount < vm.input.tradeLimit) {
                vm.input.sellAmount = parseInt(parseInt(vm.model.consumeAccount) / parseInt(vm.input.tradeLimit)) * parseInt(vm.input.tradeLimit);
            }
            //vm.input.money = parseInt(vm.model.amount);
            if (vm.input.sellAmount <= 0
                || ((vm.model.tradeLimit != null
                && vm.model.tradeLimit != 0
                && vm.input.sellAmount < vm.model.tradeLimit)
                && vm.input.otcType =='0')) {
                vm.input.sellAmount = '';
                $scope.$emit('alertWarning', '数量不足');
            }
            updateTotalPrice();
        }

        function confirm(){
            if(vm.model.selectBidding == null || $.trim(vm.model.selectBidding) == '') {
                $scope.$emit('alertWarning', '请选择是否竞价');
            }else if(vm.input.subAccountType == null
                || $.trim(vm.input.subAccountType) == ''){
                $scope.$emit('alertWarning', '请选择转账账户');
            }else if(vm.input.tradeLimit !=null
                && vm.model.tradeLimit != 0
                &&(vm.input.sellAmount < vm.input.tradeLimit)){
                $scope.$emit('alertWarning', '买卖数量低于最低额');
            }else if((vm.model.consumeAccount < vm.input.sellAmount) && vm.input.otcType =='0' ){
                $scope.$emit('alertWarning', '卖出数量不能高于可用NDL账户账户数量');
            } else if (vm.input.sellAmount % parseInt(vm.input.tradeLimit) !== 0) {
                $scope.$emit('alertWarning', '买卖数量必须是' + parseInt(vm.input.tradeLimit) + '的整数倍');
            // }else if(vm.input.sellOnePrice < vm.model.market && vm.model.selectBidding == 1){
            }else if(vm.input.sellOnePrice < vm.model.market){
                $scope.$emit('alertWarning', '买入单价不能低于市场价格');
            }else if(vm.input.sellAmount <= 0){
                $scope.$emit('alertWarning', '买卖数量过低');
            }else if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else{
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认',
                    template: '<div class="text-center">您的买卖数量为【'+ vm.input.sellAmount + '】,确认挂单么？</div>',
                    cancelText: '否',
                    okText: '是'
                });
                confirmPopup.then(function(res) {
                    if (vm.model.selectBidding == 2) {
                        vm.input.otcnc = '非竞价';
                        if(res) {
                            $ionicLoading.show();
                            OtcNbService.addOtcSell(
                                vm.input
                            ).success(function (data) {
                                $ionicNativeTransitions.stateGo('tab.otcsell-mysells', {
                                    id:data,
                                    subAccountType:vm.subAccountType,
                                    back:'account'
                                }, {}, {
                                    "type": "slide",
                                    "direction": "right"
                                });
                            }).error(function (error) {
                                //if(error.errorCode == '20326'){
                                //    $scope.$emit('alertWarning', '交易密码不正确!');
                                //}
                            }).finally(function () {
                                $ionicLoading.hide();
                            })
                        }
                    }else {
                        if(res) {
                            $ionicLoading.show();
                            OtcService.addOtcSell(
                                vm.input
                            ).success(function (data) {
                                $ionicNativeTransitions.stateGo('tab.otcsell-mysells', {
                                    id:data,
                                    subAccountType:vm.subAccountType,
                                    back:'account'
                                }, {}, {
                                    "type": "slide",
                                    "direction": "right"
                                });
                            }).error(function (error) {
                                //if(error.errorCode == '20326'){
                                //    $scope.$emit('alertWarning', '交易密码不正确!');
                                //}
                            }).finally(function () {
                                $ionicLoading.hide();
                            })
                        }
                    }
                });

            }
        }

        function subAccountChanged(subAccountType){
            vm.input.subAccountTypeOp = subAccountType;
            angular.forEach(vm.model.subAccountTypeTextList, function (item) {
                if (item.value == subAccountType) {
                    vm.input.checkCode = item.text.split(':')[4];
                    vm.model.consumeAccount = parseFloat(item.text.split(':')[3].replace(/\,/g,''));
                    return;
                }
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