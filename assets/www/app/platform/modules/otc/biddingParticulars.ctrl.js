/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BiddingParticularsCtrl', BiddingParticularsCtrl);

    BiddingParticularsCtrl.$inject = ['$ionicNativeTransitions', '$window', '$interval', '$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcService', '$ionicLoading', '$ionicPopup'];
    function BiddingParticularsCtrl($ionicNativeTransitions, $window, $interval, $stateParams, $rootScope, $scope, $state, $ionicPopover, OtcService, $ionicLoading, $ionicPopup) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.biddingSn = $stateParams.biddingSn;
        vm.typeOtc = $stateParams.otcType;
        vm.items = [];
        vm.biddingParData = [];
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.biddingNumber = '';
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        }
        vm.selectType = {value: "9999", text: '全部'};
        vm.criteria = {
            status: "9999",
            currentUser: $rootScope.userInfo.userId,
            isCurrent: "01",
            otcType: '1',
            subAccountType: vm.subAccountType
        };
        vm.model = {
            subAccountTypeText: ''
        }
        /*vm.input = {
         id:'',
         sn:'',
         status : '0',
         createUser: $rootScope.userInfo.userId,
         checkCode:'',
         subAccountType : vm.subAccountType,
         tokenOtcSellCancel:''
         };*/
        vm.input = {
            sellOnePrice: '',
            sellAmount: '',
            totalPrice: 0,
            bankCardId: '',
            status: '0',
            sn: '',
            currentUser: $rootScope.userInfo.userId,
            createUser: $rootScope.userInfo.userId,
            payPassword: '',
            checkCode: '',
            subAccountType: vm.subAccountType,
            tokenOtcSell: '',
            tradeCount: 0,
            otcType: ''
            //sellAccountType:'0015'
        };


        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });
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
        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;
        vm.reminder = reminder;
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }
        getList();

        function reminder() {

            var re = /^[0-9]+(.[0-9]{1})?$/;
            if (vm.typeOtc == 0) {
                if (vm.biddingNumber.length < 1) {
                    $scope.$emit('alertWarning', '请输入竞价金额');
                } else if(vm.biddingNumber == 0){
                    $scope.$emit('alertWarning', '竞价单价至少0.1元');
                } else if (vm.biddingNumber <= vm.biddingParData.realprice) {
                    $scope.$emit('alertWarning', '竞价单价至少高于当前单价0.1元');
                } else if (!re.test(vm.biddingNumber)) {
                    $scope.$emit('alertWarning', '输入单价只能为小数1位数');
                } else {
                    $ionicPopup.show({
                        template: '<input type="password" style="border: 0.5px solid #ddd;padding-left: 10px;" placeholder="请输入交易密码" ng-model="data.biddingPassword">',
                        title: '交易密码',
                        scope: $scope,
                        buttons: [
                            {
                                text: '确定',
                                type: 'button-balanced botton-radius',
                                onTap: function (e) {
                                    if (!$scope.data.biddingPassword) {
                                        e.preventDefault();
                                        $scope.$emit('alertWarning', '请输入交易密码');
                                    } else {
                                        vm.input.sellOnePrice = vm.biddingNumber;
                                        vm.input.payPassword = $scope.data.biddingPassword;
                                        OtcService.confimBuy(
                                            vm.input
                                        ).success(function (data) {
                                            $ionicNativeTransitions.stateGo('tab.otcbuy-mybidding', {subAccountType: vm.subAccountType}, {}, {
                                                "type": "slide",
                                                "direction": "down"
                                            });
                                        }).error(function (error) {
                                            //if(error.errorCode == '20326'){
                                            //    $scope.$emit('alertWarning', '交易密码不正确!');
                                            //}
                                        }).finally(function () {
                                            $ionicLoading.hide();
                                        });
                                    }
                                }
                            },
                            {
                                text: '取消',
                                type: 'button-org botton-radius'
                            },
                        ]
                    });
                }
            } else {
                if (vm.biddingNumber.length < 1) {
                    $scope.$emit('alertWarning', '请输入竞价金额');
                } else if(vm.biddingNumber == 0){
                    $scope.$emit('alertWarning', '竞价单价至少0.1元');
                } else if (vm.biddingNumber >= vm.biddingParData.realprice) {
                    $scope.$emit('alertWarning', '竞价单价至少低于当前单价0.1元');
                } else if (!re.test(vm.biddingNumber)) {
                    $scope.$emit('alertWarning', '输入单价只能为小数1位数');
                } else {
                    $ionicPopup.show({
                        template: '<input type="password" style="border: 0.5px solid #ddd;padding-left: 10px;" placeholder="请输入交易密码" ng-model="data.biddingPassword">',
                        title: '交易密码',
                        scope: $scope,
                        buttons: [
                            {
                                text: '确定',
                                type: 'button-balanced botton-radius',
                                onTap: function (e) {

                                    if (!$scope.data.biddingPassword) {
                                        e.preventDefault();
                                        $scope.$emit('alertWarning', '请输入交易密码');
                                    } else {
                                        vm.input.sellOnePrice = vm.biddingNumber;
                                        vm.input.payPassword = $scope.data.biddingPassword;
                                        OtcService.confimBuy(
                                            vm.input
                                        ).success(function (data) {
                                            $ionicNativeTransitions.stateGo('tab.otcbuy-mybidding', {subAccountType: vm.subAccountType}, {}, {
                                                "type": "slide",
                                                "direction": "down"
                                            });
                                        }).error(function (error) {
                                        }).finally(function () {
                                            $ionicLoading.hide();
                                        });
                                    }
                                }
                            },
                            {
                                text: '取消',
                                type: 'button-org botton-radius'
                            },
                        ]
                    });
                }
            }
            $scope.data = {};
        }

        function getList() {
            $ionicLoading.show();
            vm.criteria.status = vm.selectType.value;
            OtcService.getMyBiddingPart(vm.page.currentPage, vm.page.itemsPerPage, vm.biddingSn, vm.userId)
                .success(function (data) {
                    if (data.bidPricelist.length > 10) {
                        vm.items = data.bidPricelist.slice(0, 11);
                    } else {
                        vm.items = data.bidPricelist;
                    }
                    vm.biddingParData = data.dto;
                    vm.input = data.dto;
                    vm.input.sellAmount = data.dto.sellAmount;
                    vm.input.checkcode = data.dto.checkcode;
                    vm.input.sn = data.dto.sn;
                    vm.input.tokenOtcSell = data.dto.token;
                }).error(function (error) {
                vm.hasMoreData = false;
                vm.hasData = false;
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
            });
        }

        function doRefresh() {//下拉刷新及页面初始化加载
            getList();
        }

        function loadMore() {//上拉加载
            vm.criteria.status = vm.selectType.value;
            OtcService.getOtcMyBiddingDetailed(vm.page.currentPage, vm.page.itemsPerPage, vm.userId, vm.criteria.otcType)
                .success(function (data) {
                    vm.page = {
                        currentPage: 1,
                        itemsPerPage: 10
                    }
                    vm.items = [];
                    if (data.bidList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        vm.items = data.bidList;
                        vm.page.currentPage++;
                        if (data.bidList.length < vm.page.itemsPerPage) {
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        } else {
                            vm.hasMoreData = true;
                        }
                    }
                })
                .error(function (error) {
                    vm.hasMoreData = false;
                    vm.hasData = false;
                }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            });
        }

        $scope.finished = function (id) {
            $('#' + id).find('.count-down--main').hide();
            $('#' + id).find('.count-down--' + id).show();
            $('#' + id).unbind();
            $ionicNativeTransitions.stateGo('tab.otcbuy-mybidding', {subAccountType: vm.subAccountType}, {}, {
                "type": "slide",
                "direction": "right"
            });
        };
    }
})();