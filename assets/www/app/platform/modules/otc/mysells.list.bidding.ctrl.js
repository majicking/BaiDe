/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('OtcMySellsListBiddingCtrl', OtcMySellsListBiddingCtrl);

    OtcMySellsListBiddingCtrl.$inject = ['$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcService', '$ionicLoading', '$ionicNativeTransitions'];
    function OtcMySellsListBiddingCtrl($stateParams, $rootScope, $scope, $state, $ionicPopover, OtcService, $ionicLoading, $ionicNativeTransitions) {
        var vm = this;
        vm.subAccountType = $stateParams.subAccountType;
        vm.model = {};
        vm.hasMoreData = false;
        vm.hasData = true;
        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });
        vm.otcTypebidding = otcTypebidding;
        vm.openDetail = openDetail;
        //2018.04.16 by tourway
        $scope.visible = false;
        $scope.moreToggle = function () {
            $scope.visible = !$scope.visible;
        }

        function otcTypebidding(otcTypeVal) {
            $ionicNativeTransitions.stateGo(otcTypeVal, {
                subAccountType:vm.subAccountType
            }, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        // 2018.04.17 by tourway
        function openDetail(param) {
            var routerStr = '';
            if (vm.criteria.otcType == '1') {
                routerStr = 'tab.otcbuy-detail';
                // param.subAccountType = '0019';

            } else {
                routerStr = 'tab.otcsell-detail';
                // param.subAccountType = '0020';
            }
            //param.subAccountType = vm.subAccountType;
            $ionicNativeTransitions.stateGo(routerStr, param, {}, {
                "type": "slide",
                "direction": "right"
            });
        }
    }
})();