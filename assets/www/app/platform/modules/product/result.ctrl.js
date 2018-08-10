(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ProductResultCtrl', ProductResultCtrl);
    ProductResultCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$ionicLoading', 'ProductService'];
    function ProductResultCtrl($rootScope, $scope, $stateParams, $ionicLoading, ProductService) {
        var vm = this;
        vm.id = $stateParams.id;
        vm.subAccountType = $stateParams.subAccountType;
        vm.pattern = $stateParams.pattern;
        vm.back = $stateParams.back;
        vm.fromState = $stateParams.fromState;

        vm.model = {};

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value === vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.showPage = false;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        };

        getResult();

        function getResult(){
            $ionicLoading.show();
            ProductService.getRollResult(
                vm.id,
                vm.subAccountType,
                vm.pattern
            ).success(function (data) {
                vm.model = data;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value === vm.subAccountType) {
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