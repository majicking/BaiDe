(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('CededResultCtrl', CededResultCtrl);
    CededResultCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$ionicLoading', '$state', 'AccountService'];
    function CededResultCtrl($rootScope, $scope, $stateParams, $ionicLoading, $state, AccountService) {
        var vm = this;
        vm.id = $stateParams.id;
        vm.subAccountType = $stateParams.subAccountType;
        vm.back = $stateParams.back;

        vm.model = {};

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.showPage = false;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        getResult();

        function getResult(){
            $ionicLoading.show();
            AccountService.getCededResult(
                vm.id,
                vm.subAccountType
            ).success(function (data) {
                vm.model = data;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        item.text = vm.model.subAccountTypeText;
                        return;
                    }
                });
                vm.showPage = true;
            }).error(function (error) {
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
    }
})();