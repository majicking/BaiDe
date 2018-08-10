(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$document', '$rootScope', '$scope', '$stateParams', '$sessionStorage', '$ionicLoading', '$ionicNativeTransitions', 'UserService', '$cordovaScanning'];
    function LoginCtrl($document, $rootScope, $scope, $stateParams, $sessionStorage, $ionicLoading, $ionicNativeTransitions, UserService, $cordovaScanning) {
        var vm = this;
        vm.username = '';
        vm.password = '';
        vm.loginType = $stateParams.loginType;
        if (vm.loginType == null) {
            vm.loginType = 'left';
        }
        vm.placeholder = '用户名';
        vm.login = login;
        vm.forgot = forgot;
        vm.clearForm = clearForm;
        vm.loginChanged = loginChanged;
        vm.scanner = scanner;
        //扫描
        function scanner() {
            $cordovaScanning.commont("scanner", "").then(function (ssuc) {
                $ionicLoading.show();
                UserService.checkUserCode(ssuc).success(function (data) {
                    $ionicLoading.hide();
                    if (data.userCodeIsWork) {
                        $ionicNativeTransitions.stateGo('register', {referralCode: ssuc}, {}, {
                            "type": "slide",
                            "direction": "down"
                        });
                    } else {
                        $scope.$emit('alertWarning', '不是有效二维码');
                    }
                }).error(function (error) {
                    $scope.$emit('alertWarning', '数据取得失败');
                }).finally(function (error) {
                    $ionicLoading.hide();
                })
            }, function (error) {
                $scope.$emit('alertWarning', error);
            })
        }

        /*$document.bind("keypress", function (event) {
            if (event.keyCode == 13) {
                login();
            }
        });*/
        function login() {
            var re = null;
            if (vm.username == null
                || $.trim(vm.username) == '') {
                $scope.$emit('alertWarning', '请输入用户名');
                return;
            }
            if (vm.password == null
                || $.trim(vm.password) == '') {
                $scope.$emit('alertWarning', '请输入密码');
                return;
            }
            // $ionicLoading.show();
            if (vm.loginType == 'left') {
                UserService.login(
                    vm.username,
                    vm.password
                ).success(function (data) {
                    if(data.isMobile=="0" && data.isNomalBank=="0" && data.isPayment=="0" && data.isTrustName=="0"){
                        $ionicNativeTransitions.stateGo('register', {}, {}, {
                         "type": "slide",
                         "direction": "down"
                         });

                        // $rootScope.userInfo = $sessionStorage.userInfo = data;
                        $rootScope.isLogged = $sessionStorage.isLogged = true;
                        $rootScope.userInfo = $sessionStorage.userInfo = data;
                        $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                        $rootScope.token = $sessionStorage.token = data.token;
                    }else {
                        $rootScope.isLogged = $sessionStorage.isLogged = true;
                        $rootScope.userInfo = $sessionStorage.userInfo = data;
                        $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = data.subAccountTypeList.list;
                        $rootScope.token = $sessionStorage.token = data.token;
                        $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                         "type": "slide",
                         "direction": "down"
                         });
                    }

                }).error(function (error) {
                }).finally(function (error) {
                    $ionicLoading.hide();
                })
            } else {
                UserService.loginForQiYe(
                    vm.username,
                    vm.password
                ).success(function (data) {
                    $rootScope.isLogged = $sessionStorage.isLogged = true;
                    $rootScope.userInfo = $sessionStorage.userInfo = data;
                    $rootScope.token = $sessionStorage.token = data.token;
                    $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                        "type": "slide",
                        "direction": "down"
                    });
                }).error(function (error) {
                }).finally(function (error) {
                    $ionicLoading.hide();
                })
            }
        }

        /*
         * 扫码注册
         * */
        /*
         * 忘记密码
         * */
        function forgot() {
            if (vm.loginType == 'left') {
                $ionicNativeTransitions.stateGo('forgot', {}, {}, {
                    "type": "slide",
                    "direction": "down"
                });
            } else {
                $ionicNativeTransitions.stateGo('qiye-forgot', {}, {}, {
                    "type": "slide",
                    "direction": "down"
                });
            }
        }

        function loginChanged(loginType) {
            if (loginType == 'left') {
                vm.placeholder = '用户名/已认证手机号';
            } else {
                vm.placeholder = '管理用户名';
            }
            vm.loginType = loginType;
        }

        function clearForm() {
            vm.username = '';
            vm.password = '';
        }
    }
})();