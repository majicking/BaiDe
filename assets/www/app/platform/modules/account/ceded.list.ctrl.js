(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('CededListCtrl', CededListCtrl);

    CededListCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', 'AccountService', '$stateParams'];
    function CededListCtrl($rootScope, $scope, $ionicLoading, AccountService, $stateParams) {
        var vm = this;
        vm.subAccountType = $stateParams.subAccountType;
        vm.id = $stateParams.id;
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
            currentPage : 1,
            itemsPerPage : 10
        }

        vm.criteria = {
            userId:$rootScope.userInfo.userId,
            subAccountType:vm.subAccountType,
            id:vm.id
        }

        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        getList();

        function getList(){
            $ionicLoading.show();
            doRefresh();
        }

        function doRefresh(){
            AccountService.getCededList(1,vm.page.itemsPerPage,vm.criteria)
                .success(function (data) {
                    vm.model = data;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value == vm.subAccountType) {
                            item.text = vm.model.subAccountTypeText;
                            return;
                        }
                    });
                    vm.page = {
                        currentPage : 1,
                        itemsPerPage : 10
                    }
                    vm.items = [];
                    if(vm.model.cededModelList.length==0){
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    }else{
                        angular.forEach(vm.model.cededModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if(vm.model.cededModelList.length<vm.page.itemsPerPage){
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        }else{
                            vm.hasMoreData = true;
                        }
                    }
                })
                .error(function (error) {
                    vm.hasMoreData = false;
                    vm.hasData = false;
                }).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
        }

        function loadMore(){
            AccountService.getCededList(vm.page.currentPage,vm.page.itemsPerPage,vm.criteria)
                .success(function (data) {
                    vm.model = data;
                    angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                        if (item.value == vm.subAccountType) {
                            item.text = vm.model.subAccountTypeText;
                            return;
                        }
                    });
                    if(vm.model.cededModelList.length==0){
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    }else{
                        angular.forEach(vm.model.cededModelList, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if(vm.model.cededModelList.length<vm.page.itemsPerPage){
                            vm.hasMoreData = false;
                            vm.hasData = false;
                        }else{
                            vm.hasMoreData = true;
                        }
                    }
                })
                .error(function (error){
                    vm.hasMoreData = false;
                    vm.hasData = false;
                }).finally(function() {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
    }
})();