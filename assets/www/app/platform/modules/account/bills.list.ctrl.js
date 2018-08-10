(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BillsListCtrl', BillsListCtrl);

    BillsListCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', 'AccountService', '$stateParams'];
    function BillsListCtrl($rootScope, $scope, $ionicLoading, AccountService, $stateParams) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.subAccountType = $stateParams.subAccountType;
        vm.seqType = $stateParams.seqType;
        vm.back = $stateParams.back;
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
            subAccountType: vm.subAccountType,
            seqtype:vm.seqType
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
            AccountService.getPaymentSeqlist(1, vm.page.itemsPerPage, vm.criteria)
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
                    if (vm.model.subAccountSeqModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(vm.model.subAccountSeqModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (vm.model.subAccountSeqModelList.length < vm.page.itemsPerPage) {
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
            AccountService.getPaymentSeqlist(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.model = data;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value == vm.subAccountType) {
                            item.text = vm.model.subAccountTypeText;
                            return;
                        }
                    });
                    if (vm.model.subAccountSeqModelList.length == 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(vm.model.subAccountSeqModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (vm.model.subAccountSeqModelList.length < vm.page.itemsPerPage) {
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
                // $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
            });
        }
    }
})();