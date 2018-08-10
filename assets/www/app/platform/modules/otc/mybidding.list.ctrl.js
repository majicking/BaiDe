/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('OtcMyBiddingListCtrl', OtcMyBiddingListCtrl);


    OtcMyBiddingListCtrl.$inject = ['$ionicNativeTransitions', '$window', '$interval', '$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcService', '$ionicLoading'];
    function OtcMyBiddingListCtrl($ionicNativeTransitions, $window, $interval, $stateParams, $rootScope, $scope, $state, $ionicPopover, OtcService, $ionicLoading) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        }
        vm.selectType = {value: "9999", text: '全部'};
        vm.criteria = {
            status: "9999",
            currentUser: $rootScope.userInfo.userId,
            isCurrent: "01",
            otcType: '0',
            subAccountType: vm.subAccountType
        };
        vm.model = {
            subAccountTypeText: ''
        }
        vm.endTime = 1;
        vm.model2 = {};
        vm.input = {
            id: '',
            sn: '',
            status: '0',
            createUser: $rootScope.userInfo.userId,
            checkCode: '',
            subAccountType: vm.subAccountType,
            tokenOtcSellCancel: ''
        };
        vm.biddingCountDown = '';

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
        vm.selectItem = selectItem;
        vm.otcTypeChanged = otcTypeChanged;
        vm.goBiddingPart = goBiddingPart;
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }

        getList();

        function otcTypeChanged(otcTypeVal) {
            vm.criteria.otcType = otcTypeVal;
            getList();
            doRefresh();
        }

        function getList() {
            $ionicLoading.show();
            doRefresh();
        }

        function doRefresh() {//下拉刷新及页面初始化加载
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
                        // vm.page.currentPage++;
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

        function selectItem(item) {
            vm.selectType = item;
            $ionicLoading.show();
            doRefresh();
        }
        function goBiddingPart(url,subType,listSn,otcType,goEndTime) {//跳转到竞价详情
            if (goEndTime != 2) {
                $ionicNativeTransitions.stateGo(url, {
                    subAccountType: subType,
                    biddingSn: listSn,
                    otcType:otcType
                }, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            }else {
                // $scope.$emit('alertWarning', '此单已竞价结束，请竞其他单');
            }
        }

        $scope.finished = function (id) {
            $('#'+ id ).find('.count-down--main').hide();
            $('#'+ id ).find('.count-down--'+ id).show();
            $('#'+ id ).unbind();
        };
    }
})();