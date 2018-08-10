(function () {
    'use strict';

    angular.module('app').controller('OtcMySellsDetailCtrl', OtcMySellsDetailCtrl);
    OtcMySellsDetailCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'OtcService','OtcNbService', 'BankCardService', 'AccountService', '$stateParams'];
    function OtcMySellsDetailCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, OtcService,OtcNbService, BankCardService, AccountService, $stateParams) {
        var vm = this;
        vm.otcCurrentState = decodeURIComponent($stateParams.otcCurrentState);
        vm.preRouterUrl = $stateParams.preRouterUrl;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.model = {
            consumeAccount : 0,
            bankInfo:''
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
            createUser: $rootScope.userInfo.userId,
            currentUser:$rootScope.userInfo.userId,
            payPassword : 123,
            checkCode:'',
            subAccountType : vm.subAccountType,
            tokenOtcSell:'',
            tradeCount:0,
            //sellAccountType:'0015'
        };

        vm.disabled = true;

        vm.cancelSell = cancelSell;
        vm.cancelBuy = cancelBuy;
        vm.confirmComplet = confirmComplet;
        vm.goOut = goOut;
        // vm.pageNative = pageNative;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        vm.pageElementCon = {
            isBankShow:false, //是否显示银行卡
            isBankReal:false, //是否显示真实卡号
            bankUser:$rootScope.userInfo.userId, // 显示的银行卡用户
            isBankMoneyOrder:false, //是否显示银行汇票
            isCanUpdate:false, //是否可以上传
            isCreaterUser:false, //是否创建者
            isCurrentUser:false, //是否交易者
            isOptions:false,   //是否有操作，交易密码跟着是否有操作走
            optionBtns:{
                cancelSell:false, //是否显示取消挂单
                cancelDeal:false, //是否显示取得交易
                confirmPay:false,  //是否显示确认付款
                confirmComplet:false //是否显示交易完成
            }             
        }

        function goOut() {
            var param = {subAccountType:vm.subAccountType};
            $ionicNativeTransitions.stateGo(vm.preRouterUrl,param, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        function initPageElements(){
            var status = vm.input.status;
            var otcType = vm.input.otcType;
            var initiatorUser = vm.input.createUser;
            var accpetUser = vm.input.buyCreateUser;
            if(otcType == '0'){ //挂卖单
                if(status == '0'){ //挂单中,无人接盘时
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = initiatorUser;
                    vm.pageElementCon.isBankMoneyOrder = false;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = true;
                    vm.pageElementCon.optionBtns.cancelSell = true;
                    vm.pageElementCon.optionBtns.cancelDeal = false;
                    vm.pageElementCon.optionBtns.confirmPay = false;
                    vm.pageElementCon.optionBtns.confirmComplet = false;
                }else if(status == '1'){ //交易中,只有发起人进入,只能查看，不能操作
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = initiatorUser;
                    vm.pageElementCon.isBankMoneyOrder = false;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = false;
                    vm.pageElementCon.isCreaterUser = true;
                }else if(status == '2'){ //付款完成,只有发起人进入，查看汇票，准备交易完成
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = initiatorUser;
                    vm.pageElementCon.isBankMoneyOrder = true;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = true;
                    vm.pageElementCon.optionBtns.cancelSell = false;
                    vm.pageElementCon.optionBtns.cancelDeal = false;
                    vm.pageElementCon.optionBtns.confirmPay = false;
                    vm.pageElementCon.optionBtns.confirmComplet = true;
                    vm.pageElementCon.isCreaterUser = true;
                }else if(status == '3'){ //交易完成,只有发起人进入，不能操作，只能查看
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = initiatorUser;
                    vm.pageElementCon.isBankMoneyOrder = true;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = false;
                    vm.pageElementCon.isCreaterUser = true;
                }
            }else{ //挂买单,只有交易人进入 没有status == '0'这种情况
                if(status == '1'){ //交易中, 交易人进入
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = accpetUser;
                    vm.pageElementCon.isBankMoneyOrder = false;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = true;
                    vm.pageElementCon.optionBtns.cancelSell = false;
                    vm.pageElementCon.optionBtns.cancelDeal = true;
                    vm.pageElementCon.optionBtns.confirmPay = false;
                    vm.pageElementCon.optionBtns.confirmComplet = false;
                    vm.pageElementCon.isCurrentUser = true;
                }else if(status == '2'){ //付款完成,只有交易人进入,查看汇票，准备交易完成
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = accpetUser;
                    vm.pageElementCon.isBankMoneyOrder = true;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = true;
                    vm.pageElementCon.optionBtns.cancelSell = false;
                    vm.pageElementCon.optionBtns.cancelDeal = false;
                    vm.pageElementCon.optionBtns.confirmPay = false;
                    vm.pageElementCon.optionBtns.confirmComplet = true;
                    vm.pageElementCon.isCurrentUser = true;
                }else if(status == '3'){ //交易完成,只有交易人进入，只能查看，无法操作
                    vm.pageElementCon.isBankShow = true;
                    vm.pageElementCon.isBankReal = false;
                    vm.pageElementCon.bankUser = accpetUser;
                    vm.pageElementCon.isBankMoneyOrder = true;
                    vm.pageElementCon.isCanUpdate = false;
                    vm.pageElementCon.isOptions = false;
                    vm.pageElementCon.isCurrentUser = true;
                }
            }
        }


        function pageNative(){
            var param = {subAccountType:vm.subAccountType};
            $ionicNativeTransitions.stateGo(vm.preRouterUrl, param, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        initOtcSellAddPage();
        
        function initOtcSellAddPage(){
            // if($stateParams.preRouterUrl.length >0){
            //     vm.preRouterUrl = $stateParams.preRouterUrl;
            // }
            if(vm.preRouterUrl == 'tab.otcsell-mysellsnb'){
                $ionicLoading.show();
                OtcNbService.initOtcSellModel(vm.input)
                    .success(function(data){
                        vm.input = data;

                        $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                            if (item.value == vm.subAccountType) {
                                vm.model.subAccountTypeText = item.text;
                                return;
                            }
                        });

                        initPageElements();
                        if(vm.pageElementCon.isBankShow){
                            initBankCards();
                        }
                        //initConsumeAccount();
                    }).error(function (error) {
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }else {
                $ionicLoading.show();
                OtcService.initOtcSellModel(vm.input)
                    .success(function(data){
                        vm.input = data;

                        $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                            if (item.value == vm.subAccountType) {
                                vm.model.subAccountTypeText = item.text;
                                return;
                            }
                        });

                        initPageElements();
                        if(vm.pageElementCon.isBankShow){
                            initBankCards();
                        }
                        //initConsumeAccount();
                    }).error(function (error) {
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }
        }

        function initBankCards(){
            BankCardService.getBankCardList(vm.pageElementCon.bankUser)
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

        ///**
        // * 获取消费的账户信息
        // */
        //function initConsumeAccount(){
        //    AccountService.getAsset(vm.userId, '0010')
        //        .success(function(data){
        //            vm.model.consumeAccount = data.cashAmount;
        //            vm.model.upDown = data.upDown;
        //            vm.model.rate = data.rate;
        //            vm.model.market = data.market;
        //            vm.input.sellOnePrice = data.market;
        //        }).error(function (error) {
        //    }).finally(function () {
        //    });
        //}

        function cancelSell(){
            if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else{
                //设置当前操作为失效，也就是自己取消挂单
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认',
                    template: '<div class="text-center">您的单号为【'+ vm.input.sn + '】,确认取消挂单么？</div>',
                    cancelText: '否',
                    okText: '是'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        vm.input.status = '4';
                        vm.input.currentUser = $rootScope.userInfo.userId;
                        $ionicLoading.show();
                        OtcService.cancelOtcSell(
                            vm.input
                        ).success(function (data) {
                            pageNative();
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

        function cancelBuy(){
            if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else{
                //设置当前操作为失效，也就是自己取消挂单
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认',
                    template: '<div class="text-center">您的订单号为【' + vm.input.buySn + '】,确认取消交易么？</div>',
                    cancelText: '否',
                    okText: '是'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        vm.input.status = '0';
                        vm.input.currentUser = $rootScope.userInfo.userId;
                        $ionicLoading.show();
                        OtcService.cancelBuy(
                            vm.input
                        ).success(function (data) {
                            pageNative();
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

        function confirmComplet(){
            if(vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == ''){
                $scope.$emit('alertWarning', '请输入交易密码');
            }else{
                //设置当前操作为失效，也就是自己取消挂单
                var confirmPopup = $ionicPopup.confirm({
                    title: '确认',
                    template: '<div class="text-center">您的单号为【'+ vm.input.sn + '】,确认交易完成么？</div>',
                    cancelText: '否',
                    okText: '是'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        vm.input.status = '3';
                        vm.input.currentUser = $rootScope.userInfo.userId;
                        $ionicLoading.show();
                        OtcService.confirmComplet(
                            vm.input
                        ).success(function (data) {
                            pageNative();
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