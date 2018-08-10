/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('OtcSellListCtrl', OtcSellListCtrl);
    angular.module('starter', ['timer']);

    // angular.module('app').filter('ten', function() {
    //     return function(value) {
    //         if(value == '2'&& value != '1'){
    //
    //         }
    //     };
    // });
    OtcSellListCtrl.$inject = ['$ionicNativeTransitions', '$window', '$interval', '$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcService', '$ionicLoading'];
    function OtcSellListCtrl($ionicNativeTransitions, $window, $interval, $stateParams, $rootScope, $scope, $state, $ionicPopover, OtcService, $ionicLoading) {
        var vm = this;
        vm.items = [];
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.itemId = 0;
        vm.isClick = true;
        vm.tabs = true;
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        };
        vm.title = '竞价';
        vm.endTime = 1;
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
        vm.goDetail = goDetail;
        vm.otcTypebidding = otcTypebidding;
        vm.goBack = goBack;
        getList();
        function getList() {
            $ionicLoading.show();
            doRefresh();
        }
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }

        function goBack() {
            vm.tabs = false;
            $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        $scope.finished = function (id) {
            $('#' + id).find('.count-down--main').hide();
            $('#' + id).find('.count-down--' + id).show();
            $('#' + id).unbind();
        };
        function otcTypeChanged(otcTypeVal) {
            vm.criteria.otcType = otcTypeVal;
            getList();
        }

        function doRefresh() {//下拉刷新及页面初始化加载
            OtcService.getOtcSellList(1, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.page = {
                        currentPage: 1,
                        itemsPerPage: 10
                    }
                    vm.items = [];
                    if (data.otcSellModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        vm.items = data.otcSellModelList;
                        vm.page.currentPage++;
                        if (data.otcSellModelList.length < vm.page.itemsPerPage) {
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
            OtcService.getOtcSellList(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    if (data.otcSellModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(data.otcSellModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (data.otcSellModelList.length < vm.page.itemsPerPage) {
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

        function goDetail(tmdUrl, otcId, goEndTime, otcType) {//跳转到市场详情
            if (goEndTime != 2) {
                $ionicNativeTransitions.stateGo(tmdUrl, {
                    otcCurrentId: otcId,
                    subAccountType: '0021',
                    typeOtc: otcType
                }, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            } else {
                // $scope.$emit('alertWarning', '此单已竞价结束，请竞其他单');
            }
        }

        function otcTypebidding(otcTypeVal) {
            $ionicNativeTransitions.stateGo(otcTypeVal, {
                subAccountType: vm.subAccountType
            }, {}, {
                "type": "slide",
                "direction": "right"
            });
        }
    }
})();