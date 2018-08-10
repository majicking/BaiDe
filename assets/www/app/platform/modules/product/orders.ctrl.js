(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ProductOrdersCtrl', ProductOrdersCtrl);

    ProductOrdersCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', 'ProductService', '$stateParams'];

    function ProductOrdersCtrl($rootScope, $scope, $ionicLoading, ProductService, $stateParams) {
        var vm = this;
        vm.subAccountType = $stateParams.subAccountType;

        vm.model = {};

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value === vm.subAccountType) {
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
        };

        vm.stateList = [
            {
                value: '',
                text: '全部'
            },
            {
                value: '00',
                text: '未算力'
            },
            {
                value: '01',
                text: '算力中'
            },
            {
                value: '02',
                text: '已到期'
            }
        ];

        vm.criteria = {
            userId: $rootScope.userInfo.userId,
            subAccountType: vm.subAccountType,
            state: ''
        };

        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;
        vm.stateChanged = stateChanged;

        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        };

        getList();

        function getList() {
            $ionicLoading.show();
            doRefresh();
        }

        function doRefresh() {
            ProductService.getBillList(1, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.model.list = data;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value === vm.subAccountType) {
                            item.text = vm.model.subAccountTypeText;
                            return;
                        }
                    });
                    vm.page = {
                        currentPage: 1,
                        itemsPerPage: 10
                    };
                    vm.items = [];
                    if (vm.model.list.length === 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(vm.model.list, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (vm.model.list.length < vm.page.itemsPerPage) {
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
            ProductService.getBillList(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.model = data;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value === vm.subAccountType) {
                            item.text = vm.model.subAccountTypeText;
                            return;
                        }
                    });
                    if (vm.model.list.length === 0) {
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    } else {
                        angular.forEach(vm.model.list, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (vm.model.list.length < vm.page.itemsPerPage) {
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

        function stateChanged(state,v) {
            vm.criteria.state = state;
            getList();
        }
    }
})();