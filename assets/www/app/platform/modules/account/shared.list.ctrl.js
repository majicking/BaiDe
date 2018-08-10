(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('SharedListCtrl', SharedListCtrl);

    SharedListCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', 'AccountService'];
    function SharedListCtrl($rootScope, $scope, $ionicLoading, AccountService) {
        var vm = this;
        vm.items = [];
        vm.hasMoreData = false;
        vm.hasData = true;
        vm.page = {
            currentPage : 1,
            itemsPerPage : 10
        }

        vm.criteria = {
            userId:$rootScope.userInfo.userId
        }

        vm.loadMore = loadMore;
        vm.doRefresh = doRefresh;

        getList();

        function getList(){
            $ionicLoading.show();
            doRefresh();
        }

        function doRefresh(){
            AccountService.getSharedSeqList(1,vm.page.itemsPerPage,vm.criteria)
                .success(function (data) {
                    vm.page = {
                        currentPage : 1,
                        itemsPerPage : 10
                    }
                    vm.items = [];
                    if(data.length==0){
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    }else{
                        angular.forEach(data, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if(data.length<vm.page.itemsPerPage){
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
            AccountService.getSharedSeqList(vm.page.currentPage,vm.page.itemsPerPage,vm.criteria)
                .success(function (data) {
                    if(data.length==0){
                        vm.hasMoreData = false;
                        vm.hasData = false;
                    }else{
                        angular.forEach(data, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if(data.length<vm.page.itemsPerPage){
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