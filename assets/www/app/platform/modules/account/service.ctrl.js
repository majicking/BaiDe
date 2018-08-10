(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ServiceCtrl', ServiceCtrl);

    ServiceCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$localStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService'];
    function ServiceCtrl($rootScope, $sessionStorage, $scope, $localStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService) {
        var vm = this;

        vm.build = build;

        function build() {
            $scope.$emit('alertWarning', '建设中,敬请期待...');
        }
    }
})();