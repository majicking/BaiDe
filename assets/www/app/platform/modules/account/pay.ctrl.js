(function () {
    'use strict';

    angular.module('app').controller('PayCtrl', PayCtrl);
    PayCtrl.$inject = ['$rootScope', '$scope', '$stateParams', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService'];
    function PayCtrl($rootScope, $scope, $stateParams, $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService) {
        var vm = this;
        vm.username = $rootScope.userInfo.username;

        vm.model = {};
        vm.input = {};

        vm.code = $stateParams.code;
        vm.state = $stateParams.state;

        vm.disabled = true;


        vm.confirm = confirm;

        getPayInfo();

        function getPayInfo() {
            $ionicLoading.show();
            AccountService.getPayInfo(
                "1000.00",
                vm.code,
                vm.username
            ).success(function (data) {
                vm.model = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

        function confirm() {
            function onBridgeReady(){
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId":vm.model.appId,
                        "timeStamp":vm.model.timeStamp,
                        "nonceStr":vm.model.nonceStr,
                        "package":vm.model.package,
                        "signType":vm.model.signType,
                        "paySign":vm.model.paySign
                    },
                    function(res){
                        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                            $ionicNativeTransitions.stateGo('tab.manage-pay-result', {}, {}, {
                                "type": "slide",
                                "direction": "down"
                            });
                        }
                    }
                );
            }
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            }else{
                onBridgeReady();
            }
        }
    }
})();