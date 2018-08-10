/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('OtcSellListBiddingCtrl', OtcSellListBiddingCtrl);
    // angular.module('starter', ['timer']);
    OtcSellListBiddingCtrl.$inject = ['$ionicNativeTransitions', '$window', '$interval', '$stateParams', '$rootScope', '$scope', '$state', '$ionicPopover', 'OtcService', '$ionicLoading'];
    function OtcSellListBiddingCtrl($ionicNativeTransitions, $window, $interval, $stateParams, $rootScope, $scope, $state, $ionicPopover, OtcService, $ionicLoading) {
        var vm = this;
        vm.otcTypebidding = otcTypebidding;
        vm.goDetail = goDetail;
        function otcTypebidding(otcTypeVal) {
            console.log(otcTypeVal)
            $ionicNativeTransitions.stateGo(otcTypeVal, {}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        function goDetail(tmdUrl, otcId, goEndTime, otcType) {//跳转到市场详情
            if (goEndTime != 2) {
                $ionicNativeTransitions.stateGo(tmdUrl, {
                    otcCurrentId: otcId,
                    subAccountType: '0021',
                    typeOtc: otcType
                }, {}, {
                    "type": "slide",
                    "direction": "right"
                });
            } else {
                // $scope.$emit('alertWarning', '此单已竞价结束，请竞其他单');
            }
        }
    }
})();