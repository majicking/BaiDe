(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BillListCtrl', BillListCtrl);

    BillListCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', 'AccountService', '$stateParams'];

    function BillListCtrl($rootScope, $scope, $ionicLoading, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.seqType = $stateParams.seqType;
        vm.model = {};
        vm.transactionRecord = '';
        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });
        vm.items = [];
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        }

        vm.criteria = {
            userId: $rootScope.userInfo.userId,
            subAccountType: vm.subAccountType
        }

        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }
        getList();

        function getList() {
            $ionicLoading.show();
            doRefresh();
        }

        function doRefresh() {
            AccountService.getIdsFromTransferBill(
                vm.criteria.userId,
                vm.criteria.subAccountType
            ).success(function (data) {
                vm.criteria.idsStr = JSON.stringify(data);
                AccountService.getBillList(1, vm.page.itemsPerPage, vm.criteria)
                    .success(function (data) {
                        vm.model = data;
                        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                            if (item.value == vm.subAccountType) {
                                item.text = vm.model.subAccountTypeText;
                                return;
                            }
                        });
                        vm.page = {
                            currentPage: 1,
                            itemsPerPage: 10
                        }
                        vm.items = [];
                        if (vm.model.billModelList.length == 0) {
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        } else {
                            angular.forEach(vm.model.billModelList, function (item) {
                                vm.items.push(item);
                            });
                            vm.page.currentPage++;
                            if (vm.model.billModelList.length < vm.page.itemsPerPage) {
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
            }).error(function (error) {
            }).finally(function () {
            });
        }

        function loadMore() {
            AccountService.getIdsFromTransferBill(
                vm.criteria.userId,
                vm.criteria.subAccountType
            ).success(function (data) {
                vm.criteria.idsStr = JSON.stringify(data);
                AccountService.getBillList(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                    .success(function (data) {
                        vm.model = data;
                        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                            if (item.value == vm.subAccountType) {
                                item.text = vm.model.subAccountTypeText;
                                return;
                            }
                        });
                        if (vm.model.billModelList.length == 0) {
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        } else {
                            angular.forEach(vm.model.billModelList, function (item) {
                                vm.items.push(item);
                            });
                            vm.page.currentPage++;
                            if (vm.model.billModelList.length < vm.page.itemsPerPage) {
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
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }).error(function (error) {
            }).finally(function () {
            });
        }
    }
})();