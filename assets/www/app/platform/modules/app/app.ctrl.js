/**
 * Created by lifeng on 2016/2/16.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('AppCtrl', AppCtrl);

    AppCtrl.$inject = ['$scope','$ionicNativeTransitions'];
    function AppCtrl( $scope,$ionicNativeTransitions) {
        var app = this;

        $scope.goNativeBack = goNativeBack;

        function goNativeBack(state){
            $ionicNativeTransitions.stateGo(state, {}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        $scope.goNativeBackParams = goNativeBackParams;

        function goNativeBackParams(state, params){
            $ionicNativeTransitions.stateGo(state, params, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        $scope.writeClear = writeClear;

        function writeClear($event, className) {
            var o = $event.target;
            if (o.value == null
                || $.trim(o.value) == '') {
                o.parentNode.classList.add(className);
            } else {
                o.parentNode.classList.remove(className);
            }
        }

        $scope.writeBlur = writeBlur;

        function writeBlur($event, className) {
            var o = $event.target;
            o.parentNode.classList.add(className);
        }

        $scope.$on('alertWarning', function(event,data) {
            alertWarning(data,"");
        });

        $scope.$on('alertWarningCallBack', function(event,data,fun) {
            alertWarningCallBack(data,"",fun);
        });

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

        function alertWarningCallBack(text,lv,fun){
            $(".warningBox").remove();
            if(lv==null){
                lv = "";
            }
            var warningBox = createDiv("warningBox fixTop "+lv, text);
            $(warningBox).addClass("fadeOut")
            warningBox.addEventListener("webkitAnimationEnd", function () {
                $(this).remove();
            })
            fun();
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
    }
})();