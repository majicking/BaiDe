/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';
    /* Controllers */
    angular.module('app').controller('ProductListCtrl', ProductListCtrl);
    ProductListCtrl.$inject = ['$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'ProductService', '$ionicLoading'];
    function ProductListCtrl($stateParams, $rootScope, $scope, $state, $ionicPopover, ProductService, $ionicLoading) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;
        vm.getAsset = getAsset;//固定期限
        //vm.getCurrent=getCurrent;//活期理财
        vm.doRefresh = doRefresh;//下拉刷新
        vm.test = 'test';
        vm.getAsset();
        //vm.getCurrent();
        /*
        * 固定期限请求数据
        * */
        function getAsset() {
            $ionicLoading.show();
            ProductService.getAsset(
                vm.userId
            ).success(function (data) {
                vm.model = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
        /*
        * 活期理财请求数据
        * */
        /*function getCurrent() {
            $ionicLoading.show();
            ProductService.getCurrent(
                vm.userId
            ).success(function (data) {
                vm.model = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }*/
        /*
        * 下拉刷新请求数据
        * */
        function doRefresh() {
            ProductService.getAsset(
                vm.userId
            ).success(function (data) {
                vm.model = data;

            }).error(function (error) {
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    }
})();