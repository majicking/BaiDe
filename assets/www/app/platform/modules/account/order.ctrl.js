(function () {
    'use strict';

    angular.module('app').controller('OrderCtrl', OrderCtrl);
    OrderCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', '$ionicPopup', '$state', 'AccountService'];
    function OrderCtrl($rootScope, $scope, $ionicLoading, $ionicPopup, $state, AccountService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.model = {};
        vm.input = {};

        vm.disabled = true;


        vm.confirm = confirm;

        //getPayInfo();

        function getPayInfo() {
            $ionicLoading.show();
            AccountService.getPayInfo(
                vm.memberId
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
                        "appId":"wxf4fed5093ed0fc8e",
                        "timeStamp":new Date().getTime()+"",
                        "nonceStr":"e61463f8efa94090b1f366cccfbbb444",
                        "package":"prepay_id=u802345jgfjsdfgsdg888",
                        "signType":"MD5",
                        "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89"
                    },
                    function(res){
                        if(res.err_msg == "get_brand_wcpay_request：ok" ) {

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