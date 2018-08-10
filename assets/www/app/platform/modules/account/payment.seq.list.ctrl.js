(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('PaymentSeqListCtrl', PaymentSeqListCtrl);

    PaymentSeqListCtrl.$inject = ['$rootScope', '$stateParams', '$scope', '$ionicLoading', 'AccountService', 'MstrService'];

    function PaymentSeqListCtrl($rootScope, $stateParams, $scope, $ionicLoading, AccountService, MstrService) {
        var vm = this;
        vm.subAccountType = $stateParams.subAccountType;
        vm.back = $stateParams.back;

        vm.model = {};

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
            seqType: ''
        }


        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;
        vm.selectItem = selectItem;

        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }

        getMasterList('SELECT_TYPE');

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
            // vm.criteria.seqType = vm.selectType.value;
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
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        function selectItem(item) {
            vm.selectType = item;
            vm.criteria.seqType = item.value;
            $ionicLoading.show();
            doRefresh();
        }

        function getMasterList(type) {
            MstrService.getMasterList(type)
                .success(function (data) {
                    var array = [];
                    var subType = vm.subAccountType;
                    switch (type) {
                        case 'SELECT_TYPE' :
                            var arr  = data.list;
                            /*根据不同的页面判断筛选按钮*/
                               if (subType == "0031") {
                                    array.push(arr[0]);
                                    array.push(arr[2]);
                                    array.push(arr[3]);
                                    array.push(arr[4]);
                                    array.push(arr[6]);
                                } else if (subType == "0034") {
                                    array.push(arr[1]);
                                    array.push(arr[2]);
                                    array.push(arr[4]);
                                } else if (subType == "0035") {
                                    array.push(arr[0]);
                                    array.push(arr[1]);
                                    array.push(arr[2]);
                                } else if (subType == "0036") {
                                    array.push(arr[2]);
                                    array.push(arr[4]);
                                } else if (subType == "0037") {
                                    array.push(arr[0]);
                                    array.push(arr[2]);
                                    array.push(arr[5]);
                                }
                            vm.selectTypes = array;
                            break;
                    }
                }).error(function () {
            });
        }
    }
})();