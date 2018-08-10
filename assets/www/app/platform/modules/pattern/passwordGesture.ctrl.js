/**
 * Created by lifeng on 2016/1/19.
 */
(function () {
    'use strict';
    /* Controllers */
    angular.module('app').controller('PatternPassWordGestureCtrl', PatternPassWordGestureCtrl);
    PatternPassWordGestureCtrl.$inject = ['$stateParams', '$rootScope', '$sessionStorage', '$localStorage', '$scope', '$state', '$ionicPopover','$ionicNativeTransitions', '$ionicLoading','WelcomeService','$cordovaScanning'];
    function PatternPassWordGestureCtrl($stateParams, $rootScope, $sessionStorage, $localStorage, $scope, $state, $ionicPopover,$ionicNativeTransitions, $ionicLoading,WelcomeService,$cordovaScanning) {
        var vm = this;
        vm.c_showPattern = true; //是否显示手势密码面板
        vm.changeState = true;
        vm.uuid = '';
        vm.imgURL = localStorage.getItem('userPortrait');

        vm.change = change;
        vm.checkPatternNoLogin = checkPatternNoLogin;
        vm.numberState = 0;

        function checkPatternNoLogin(loginPattern) {
            $cordovaScanning.commont("devices", "").then(function (data) {
                vm.uuid = data;

                $ionicLoading.show();
                WelcomeService.checkPatternNoLogin(vm.uuid,loginPattern).success(function (data) {
                    if(data.checkFlag == undefined){
                        $rootScope.isLogged = $sessionStorage.isLogged = true;
                        $rootScope.userInfo = $sessionStorage.userInfo = data;
                        $rootScope.token = $sessionStorage.token = data.token;
                        $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                            "type": "slide",
                            "direction": "down"
                        });
                    }else {
                        vm.numberState++;
                        $scope.$emit('alertWarningCallBack', '手势密码错误！',function(){
                            lock.reset();
                        });
                        if (vm.numberState >= 5){
                            vm.numberState = 0;
                            setTimeout(function () {
                                $ionicNativeTransitions.stateGo('login', {}, {}, {
                                    "type": "slide",
                                    "direction": "right"
                                });
                            },3000)
                            return false;
                        }
                        return false;
                    }
                }).error(function (error) {
                }).finally(function () {
                    $ionicLoading.hide();
                });
            });
        }

        var lock = new PatternLock('#lockPattern', {
            //allowRepeat : true,   //点可以重复
            //radius:30,            //圆大小
            margin:25,            //圆间距
            //matrix:[4,4],         //不同的矩阵模式
            //lineOnMove:true,      //线是否跟着手势移动
            //patternVisible:false, //滑动时，轨迹是否显示
            //delimiter:'&',        //数值间分割符
            onDraw:function(pattern){
                if(pattern.length>=4){
                    $scope.$apply(function () {
                        vm.checkPatternNoLogin(pattern);
//                        lock.reset();
                    });
                }else{
                    $scope.$emit('alertWarningCallBack', '手势密码必须大于4位',function(){
                        lock.reset();
                    });
                }
            }
        });
        // 是否隐藏轨迹
        function change(bl) {
            if(bl){
                vm.changeState = false;
                lock.option('patternVisible',false);
            }else {
                vm.changeState = true;
                lock.option('patternVisible',true);
            }
        }
    }
})();