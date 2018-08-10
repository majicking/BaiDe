/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('OtcSellListNbCtrl', OtcSellListNbCtrl);

    OtcSellListNbCtrl.$inject = ['$ionicNativeTransitions', '$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcNbService', '$ionicLoading'];
    function OtcSellListNbCtrl($ionicNativeTransitions, $stateParams, $rootScope, $scope, $state, $ionicPopover, OtcNbService, $ionicLoading) {
        var vm = this;
        vm.items = [];
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.tabActived = true; //设置默认css样式
        vm.translatex = false;
        vm.tabs = true;
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        }
        vm.title = '非竞价';
        vm.criteria = {
            status: 0,
            otcType: 0,
            subAccountType: '0031'
        };

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
        vm.otcTypeChanged = otcTypeChanged;
        vm.returnClass = returnClass;
        vm.otcTypebidding = otcTypebidding;
        vm.goBack = goBack;
        vm.goDetail = goDetail;
        getList();

        function getList() {
            $ionicLoading.show();
            doRefresh();
        }

        function returnClass(v) {
            var strClass = '';
            if (v == '挂单中') {
                strClass = 'state-guadan';
            } else if (v == '交易中') {
                strClass = 'state-deal';
            } else if (v == '已付款') {
                strClass = 'state-payment';
            } else if (v == '交易完成') {
                strClass = 'state-complete';
            } else if (v == '取消') {
                strClass = 'state-cancel';
            } else {
                strClass = 'state-cancel';
            }
            return strClass;
        }

        function goBack() {
            vm.tabs = false;
            $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        function otcTypeChanged(otcTypeVal) {
            vm.criteria.otcType = otcTypeVal;
            doRefresh();
            if (otcTypeVal === 0) {
                vm.tabActived = true;
                vm.translatex = false;
            } else {
                vm.translatex = true;
                vm.tabActived = false;
            }
        }

        function doRefresh() {
            OtcNbService.getOtcSellList(1, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.page = {
                        currentPage: 1,
                        itemsPerPage: 10
                    }
                    vm.items = [];
                    if (data.otcSellNbModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(data.otcSellNbModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (data.otcSellNbModelList.length < vm.page.itemsPerPage) {
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

        function loadMore() {
            OtcNbService.getOtcSellList(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    if (data.otcSellNbModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(data.otcSellNbModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (data.otcSellNbModelList.length < vm.page.itemsPerPage) {
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        } else {
                            vm.hasMoreData = true;
                        }
                    }
                }).error(function (error) {
                vm.hasMoreData = false;
                vm.hasData = false;
            }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        function otcTypebidding(otcTypeVal) {
            $ionicNativeTransitions.stateGo(otcTypeVal, {
                subAccountType: vm.subAccountType
            }, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        function goDetail(tmdUrl, otcId, otcType, subAccountType) {//跳转到市场详情
            $ionicNativeTransitions.stateGo(tmdUrl, {
                otcCurrentId: otcId,
                subAccountType: subAccountType,
                typeOtc: otcType
            }, {}, {
                "type": "slide",
                "direction": "right"
            });
        }
    }
})();