/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BankCardListCtrl', BankCardListCtrl);

    BankCardListCtrl.$inject = ['$rootScope', '$ionicLoading', 'BankCardService'];
    function BankCardListCtrl($rootScope, $ionicLoading, BankCardService) {
        var vm = this;
        vm.showPage = false;
        vm.userId = $rootScope.userInfo.userId;
        vm.items = [];
        vm.hasNoData = false;

        vm.getBankList = getBankList;

        vm.useBankCard = useBankCard;

        vm.getBankList();

        function useBankCard(model){
            $ionicLoading.show();
            BankCardService.useBankCard(vm.userId,model.id)
                .success(function (data) {
                    angular.forEach(vm.items, function (item) {
                        if(item.id==model.id){
                            item.used = 1;
                        }else{
                            item.used = 0;
                        }
                    });
                }).error(function (error) {
                }).finally(function (error) {
                    $ionicLoading.hide();
                });
        }

        function getBankList(){
            $ionicLoading.show();
            BankCardService.getBankCardList(vm.userId)
                .success(function (data) {
                    if(data.length==0){
                        vm.hasNoData = true;
                    }else{
                        angular.forEach(data, function (item) {
                            vm.items.push(item);
                        });
                    }
                    vm.showPage = true;
                }).error(function (error) {
                }).finally(function (error) {
                    $ionicLoading.hide();
                });
        }
    }
})();

