(function () {
    'use strict';

    /* Services */
    angular.module('app').factory('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['$q', '$injector', '$log'];
    function HttpInterceptor($q ,$injector, $log) {
        //var $ionicLoading;
        var $ionicPopup;
        return {
            request: function(config) {
                //$ionicLoading = $ionicLoading || $injector.get('$ionicLoading');
                //$ionicLoading.show({
                //    template: '<ion-spinner icon="circles"></ion-spinner>'
                //});
                return config;
            },
            requestError: function(rejection) {
                //$ionicLoading = $ionicLoading || $injector.get('$ionicLoading');
                //$ionicLoading.hide();
                $log.error('Request error:', rejection);
                return $q.reject(rejection);
            },
            response: function(response) {
                //$ionicLoading = $ionicLoading || $injector.get('$ionicLoading');
                //$ionicLoading.hide();
                var message;
                if(undefined != response.data.message && "" != response.data.message && response.data.code != 1){
                    message = response.data.message;
                    if(message){
                        alertWarning(message);
                    }
                    //$ionicPopup = $ionicPopup || $injector.get('$ionicPopup');
                    //$ionicPopup.alert({
                    //    title: "信息",
                    //    template: '<div class="text-center">'+message+'</div>'
                    //})
                }
                return response;
            },
            responseError: function(rejection) {
                //$ionicLoading = $ionicLoading || $injector.get('$ionicLoading');
                //$ionicLoading.hide();
                var message;
                if(undefined != rejection.data.message){
                    message = rejection.data.message;
                }else {
                    var status = rejection.status;
                    if(status=="404"){
                        message = "抱歉，找不到您所请求的资源。"
                    }else{
                        message = "";
                    }
                }
                if(message){
                    alertWarning(message);
                }
                //$ionicPopup = $ionicPopup || $injector.get('$ionicPopup');
                //$ionicPopup.alert({
                //    title: "错误",
                //    template: '<div class="text-center">'+message+'</div>'
                //})
                return $q.reject(rejection);
            }
        };
    }
    function alertWarning(text,lv){
        $(".warningBox").remove();
        if(lv==null){
            lv = "";
        }
        var warningBox = createDiv("warningBox fixTop "+lv, text);
        $(warningBox).addClass("fadeOut")
        warningBox.addEventListener("webkitAnimationEnd", function () {
            $(this).remove();
        })
    }

    function createDiv(className, innerHTML) {
        var oDiv = document.createElement("div");
        oDiv.className = className;
        if (innerHTML) {
            oDiv.innerHTML = innerHTML
        }
        document.body.appendChild(oDiv);
        return oDiv;
    }
})();
