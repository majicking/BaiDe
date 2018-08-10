/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('UserGraphCtrl', UserGraphCtrl);

    UserGraphCtrl.$inject = ['$scope','$rootScope','$state','$ionicPopup', '$ionicLoading', 'AccountService'];
    function UserGraphCtrl($scope,$rootScope,$state,$ionicPopup, $ionicLoading, AccountService) {
        var vm = this;
        vm.showPage = true;
        vm.username = $rootScope.userInfo.username;

        vm.totalItems = 0;
        vm.currentPage = 1;
        vm.itemsPerPage = 5;
        vm.totalPages = calculateTotalPages(vm.totalItems, vm.itemsPerPage);
        vm.items = [];
        vm.total = 0;

        vm.model = {};

        vm.stack = [];
        vm.search = search;
        vm.goBack = goBack;

        getMemberGraph(vm.username,true);

        function search(currentPage,username,isPush){
            vm.currentPage = currentPage;
            getMemberGraph(username,isPush)
        }

        function goBack(){
            vm.stack.splice(vm.stack.length-1, vm.stack.length);
            vm.model = vm.stack[vm.stack.length-1];
            vm.username = vm.model.username;
            vm.items = vm.model.items;
            vm.total = vm.model.total;
            vm.totalItems = vm.model.totalItems;
            vm.currentPage = vm.model.currentPage;
            vm.totalPages = vm.model.totalPages;
        }

        function getMemberGraph(username,isPush){
            $ionicLoading.show();
            var criteria = {
                username : username
            }
            AccountService.getUserGraph(
                vm.currentPage,
                vm.itemsPerPage,
                criteria
            ).success(function (data) {
                if(data){
                    vm.model = {};
                    vm.model.username = username;
                    vm.model.currentPage = data.page.currentPage;
                    vm.model.totalItems = data.page.totalItems;
                    vm.model.totalPages = calculateTotalPages(data.page.totalItems, vm.itemsPerPage);
                    vm.model.items = data.page.list;
                    vm.model.total = data.total;
                    if(isPush){
                        vm.stack.push(vm.model);
                    }else{
                        vm.stack[vm.stack.length-1] = vm.model;
                    }
                    vm.username = vm.model.username;
                    vm.items = vm.model.items;
                    vm.total = vm.model.total;
                    vm.totalItems = vm.model.totalItems;
                    vm.currentPage = vm.model.currentPage;
                    vm.totalPages = vm.model.totalPages;
                }
            }).error(function (error) {
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
    }

    function calculateTotalPages(totalItems, itemsPerPage) {
        var totalPages = itemsPerPage < 1 ? 1 : Math.ceil(totalItems / itemsPerPage);
        return Math.max(totalPages || 0, 1);
    }
})();

