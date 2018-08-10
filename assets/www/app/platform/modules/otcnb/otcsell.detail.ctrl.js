(function () {
    'use strict';

    angular.module('app').controller('OtcSellDetailNbCtrl', OtcSellDetailNbCtrl);
    OtcSellDetailNbCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'OtcNbService', 'BankCardService', 'AccountService', '$stateParams'];
    function OtcSellDetailNbCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, OtcNbService, BankCardService, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        //vm.subAccountType = '0010';
        vm.subAccountType = $stateParams.subAccountType;
        vm.typeOtc = $stateParams.typeOtc;
        vm.isConfimBuy = false;
        vm.model = {
            consumeAccount : 0,
            bankInfo:'',
            imgAddr:'',
            currentBuyId:$stateParams.currentBuyId
        };

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.bankInfo = {};
        vm.input = {
            id: $stateParams.otcCurrentId,
            sellOnePrice : '',
            sellAmount : '',
            totalPrice : 0,
            bankCardId : '',
            status : '0',
            currentUser: $rootScope.userInfo.userId,
            createUser: '',
            payPassword : '',
            checkCode:'',
            subAccountType : vm.subAccountType,
            tokenOtcSell:'',
            tradeCount:0,
            otcType:'',
            //sellAccountType:'0015'
        };
        vm.pageContent = {
            otcStr:'卖出',
            btnStr:'买入'
        }

        vm.confirmBuy = confirmBuy;
        vm.subAccountChanged = subAccountChanged;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        initOtcSellAddPage();
        initBankCards();
        initConsumeAccount();

        function initOtcSellAddPage(){
            $ionicLoading.show();
            OtcNbService.initOtcSellModel(vm.input)
                .success(function(data){
                    vm.input = data;
                    vm.input.tokenOtcSell = data.tokenOtcSell;
                    vm.input.currentUser = $rootScope.userInfo.userId;
                    vm.model.subAccountTypeTextList = data.subAccountTypeTextList.list;
                    vm.input.subAccountTypeTextList = undefined;

                    $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value == vm.subAccountType) {
                            vm.model.subAccountTypeText = item.text;
                            return;
                        }
                    });

                    subAccountChanged('0031');
                    initPageContentByOtcType();
                    if ((vm.input.otcType=='1'
                        && vm.input.currentUser!=vm.input.createUser)
                        || (vm.input.otcType=='0'
                        && vm.input.currentUser==vm.input.createUser)) {
                        initBankCards();
                    }
                    initConsumeAccount();
                }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function initPageContentByOtcType(){
            if(vm.input.currentUser == vm.input.createUser){
                if (vm.input.otcType == '0') {
                    vm.pageContent.otcStr = '卖出';
                    vm.pageContent.btnStr = '卖出';
                } else {
                    vm.pageContent.otcStr = '买入';
                    vm.pageContent.btnStr = '买入';
                }
            }else {
                if (vm.input.otcType == '0') {
                    vm.pageContent.otcStr = '买入';
                    vm.pageContent.btnStr = '买入';
                } else {
                    vm.pageContent.otcStr = '卖出';
                    vm.pageContent.btnStr = '卖出';
                }
            }
        }
        function initBankCards(){
            BankCardService.getBankCardList(vm.input.currentUser)
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
                    // vm.model.consumeAccount = data.cashAmount;
                    vm.model.upDown = data.upDown;
                    vm.model.rate = data.rate;
                    vm.model.market = data.market;
                    vm.input.sellOnePrice = data.market;
                }).error(function (error) {
            }).finally(function () {
            });
        }

        function confirmBuy(){
            if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else if((vm.model.consumeAccount < vm.input.sellAmount) && vm.input.otcType =='1' ){
                $scope.$emit('alertWarning', '账户数量不够，无法卖出');
            }else{
                //设置当前操作为失效，也就是自己取消挂单
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认',
                    template: '<div class="text-center">您的单号为【'+ vm.input.sn + '】,确认'+vm.pageContent.btnStr+'么？</div>',
                    cancelText: '否',
                    okText: '是'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        vm.input.status = '1';
                        vm.input.currentUser = $rootScope.userInfo.userId;
                        $ionicLoading.show();
                        OtcNbService.confimBuy(
                            vm.input
                        ).success(function (data) {
                            $ionicNativeTransitions.stateGo('tab.market-listnb', {
                                subAccountType:vm.subAccountType
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