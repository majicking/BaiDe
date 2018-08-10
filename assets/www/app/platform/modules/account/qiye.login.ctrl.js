(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('QiYeLoginCtrl', QiYeLoginCtrl);

    QiYeLoginCtrl.$inject = ['$rootScope', '$scope', '$sessionStorage', '$ionicLoading', '$state', 'UserService'];
    function QiYeLoginCtrl($rootScope, $scope, $sessionStorage, $ionicLoading, $state, UserService) {
        var vm = this;
        vm.username = '';
        vm.password = '';

        vm.login = login;
        vm.clearForm = clearForm;

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
            $ionicLoading.show();
            UserService.loginForQiYe(
                vm.username,
                vm.password
            ).success(function (data) {
                $rootScope.isLogged = $sessionStorage.isLogged = true;
                $rootScope.userInfo = $sessionStorage.userInfo = data;
                $rootScope.token = $sessionStorage.token = data.token;
                $state.go('tab.account');
            }).error(function (error) {
            }).finally(function(error){
                $ionicLoading.hide();
            })
        }

        function clearForm() {
            vm.username = '';
            vm.password = '';
        }
    }
})();