(function () {
    'use strict';

    angular.module('app').controller('OtcMySellsAddNbCtrl', OtcMySellsAddNbCtrl);
    OtcMySellsAddNbCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'OtcNbService', 'BankCardService', 'AccountService', '$stateParams'];
    function OtcMySellsAddNbCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, OtcNbService, BankCardService, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.tabActived = true; //设置默认css样式
        vm.translatex = false;

        vm.model = {
            subAccountTypeList : $rootScope.userInfo.subAccountTypeList,
            consumeAccount : 0,
            bankInfo:''
        };
        vm.bankInfo = {};
        vm.input = {
            sellOnePrice : '',
            sellAmount : '',
            totalPrice : 0,
            bankCardId : '',
            status : '0',
            createUser: $rootScope.userInfo.userId,
            payPassword : '',
            checkCode:'',
            subAccountType : vm.subAccountType,
            tokenOtcSell:'',
            otcType:'0',
            tradeLimit:'',
            tradeCount:0,
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

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        initOtcSellAddPage();
        initBankCards();
        initConsumeAccount();

        function otcTypeChanged(otcTypeVal){
            vm.input.otcType = otcTypeVal;
            if(otcTypeVal === 0){
                vm.tabActived = true;
                vm.translatex = false;
            }else {
                vm.translatex = true;
                vm.tabActived = false;
            }
            if(vm.input.otcType == '0'){
                vm.pageContent.amountStr='卖出数量';
                vm.pageContent.otcStr = '卖出';
            }else{
                vm.pageContent.amountStr='买入数量';
                vm.pageContent.otcStr = '买入';
            }
            vm.input.payPassword = '';
            vm.input.sellNum='';
        }

        function initOtcSellAddPage(){
            OtcNbService.initOtcSellModel(vm.input)
                .success(function(data){
                    //vm.input.checkCode = data.checkCode;
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
                    //vm.model.consumeAccount = data.cashAmount;
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
                || ((vm.input.tradeLimit != null
                && vm.input.tradeLimit != 0
                && vm.input.sellAmount < vm.model.tradeLimit)
                && vm.input.otcType =='0')) {
                vm.input.sellAmount = '';
                $scope.$emit('alertWarning', '数量不足');
            }
            updateTotalPrice();
        }

        function confirm(){
            if(vm.input.subAccountType == null
                || $.trim(vm.input.subAccountType) == ''){
                $scope.$emit('alertWarning', '请选择转账账户');
            }else if(vm.input.tradeLimit !=null
                && vm.input.tradeLimit != 0
                &&(vm.input.sellAmount < parseInt(vm.input.tradeLimit))){
                $scope.$emit('alertWarning', '买卖数量低于最低额');
            }else if((vm.model.consumeAccount < vm.input.sellAmount) && vm.input.otcType =='0' ){
                $scope.$emit('alertWarning', '卖出数量不能高于BUCN账户数量');
            } else if (vm.input.sellAmount % parseInt(vm.input.tradeLimit) !== 0) {
                $scope.$emit('alertWarning', '买卖数量必须是' + parseInt(vm.input.tradeLimit) + '的整数倍');
            }else if(vm.model.market < vm.input.sellOnePrice){
                $scope.$emit('alertWarning', '买入单价不能高于实时价格');
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