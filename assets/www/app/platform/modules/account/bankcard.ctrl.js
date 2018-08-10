/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BankCardCtrl', BankCardCtrl);

    BankCardCtrl.$inject = ['$rootScope','$scope', '$ionicNativeTransitions', '$stateParams', '$ionicLoading','$ionicActionSheet', '$sessionStorage', 'BankCardService'];
    function BankCardCtrl($rootScope,$scope, $ionicNativeTransitions, $stateParams, $ionicLoading,$ionicActionSheet, $sessionStorage, BankCardService) {
        var vm = this;
        vm.showPage = false;
        vm.userId = $rootScope.userInfo.userId;
        var id = parseInt($stateParams.id);

        vm.model = {};

        vm.showActionSheet = showActionSheet;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        getBankCard();

        function getBankCard(){
            $ionicLoading.show();
            BankCardService.getBankCard(vm.userId,id)
                .success(function (data) {
                    vm.model = data;
                    vm.showPage = true;
                }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }

        function showActionSheet() {
            $ionicActionSheet.show({
                buttons: [
                    { text: '默认使用该卡' }
                ],
                destructiveText: '解除绑定',
                titleText: '管理银行卡',
                cancelText: '取消',
                destructiveButtonClicked : function() {//解除绑定
                    $ionicLoading.show();
                    BankCardService.remove(vm.userId, id)
                        .success(function (data) {
                            $rootScope.userInfo.isNomalBank = $sessionStorage.userInfo.isNomalBank = data;
                            $ionicNativeTransitions.stateGo('tab.manage-bankcard-list', {}, {}, {
                                "type": "slide",
                                "direction": "right"
                            });
                        }).error(function (error) {
                    }).finally(function (error) {
                        $ionicLoading.hide();
                    });
                    return true;
                },
                buttonClicked: function(index) {//默认使用该卡
                    $ionicLoading.show();
                    BankCardService.useBankCard(vm.userId,id)
                        .success(function (data) {
                        }).error(function (error) {
                    }).finally(function (error) {
                        $ionicLoading.hide();
                    });
                    return true;
                }
            });
        }
    }
})();

