/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('NoticeCtrl', NoticeCtrl);

    NoticeCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$ionicLoading', 'NoticeService', '$sce'];
    function NoticeCtrl($rootScope, $scope, $state, $stateParams, $ionicLoading, NoticeService, $sce) {
        var vm = this;
        vm.showPage = false;
        vm.model = {};

        get();

        function get(){
            $ionicLoading.show();
            var id = $stateParams.id;
            NoticeService.get(id)
                .success(function (data) {
                    vm.model = data;
                    vm.model.content = $sce.trustAsHtml(data.content);
                    $ionicLoading.hide();
                    vm.showPage = true;
                }).error(function(){
                $ionicLoading.hide();
            });
        }
    }
})();