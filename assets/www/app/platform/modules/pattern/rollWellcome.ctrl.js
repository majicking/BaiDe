(function () {
    'use strict';

    angular.module('app').controller('ProductRollWellComeInCtrl', ProductRollWellComeInCtrl);
    ProductRollWellComeInCtrl.$inject = ['WelcomeService','$filter','$rootScope', '$sessionStorage', '$scope', '$ionicLoading', '$ionicNativeTransitions', 'ProductService', '$stateParams', '$cordovaScanning'];

    function ProductRollWellComeInCtrl(WelcomeService,$filter,$rootScope, $sessionStorage, $scope, $ionicLoading, $ionicNativeTransitions, ProductService, $stateParams, $cordovaScanning) {
        var vm = this;
        vm.uuid = '';
        vm.userId = $rootScope.userInfo.userId;
        vm.tradeType = $stateParams.tradeType;
        vm.subAccountType = $stateParams.subAccountType;
        vm.productType = '';
        vm.model = {};
        vm.moerv={};
        vm.items = [];
        vm.hasMoreData = false;
        vm.page = {
            currentPage: 1,
            itemsPerPage: 10
        };

        vm.criteria = {
            tradeType: vm.tradeType
        }

        vm.input = {
            money: null,
            payPassword: '',
            productSessionToken: void 0
        };
        vm.loadMore = loadMore;
        vm.welComeLoginGoNativeBackParams = welComeLoginGoNativeBackParams;
        vm.goTowelcome = goTowelcome;
        vm.rollwelcomeParameter=rollwelcomeParameter;
        vm.rollwelcomeParameter();
        productTpye();
        function goTowelcome(v) {
            $ionicNativeTransitions.stateGo(v,{}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }
        function productTpye(){
            if(vm.tradeType == '01'){
                return vm.productType = '临时节点';
            }else{
                return vm.productType = '固定节点';
            }
        }
        function rollwelcomeParameter() {
            ProductService.rollwelcomeParameter(
                vm.tradeType
            ).success(function (data) {
                vm.model = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }
        //登录效验
        function welComeLoginGoNativeBackParams(state, params){
            if($rootScope.isLogged==false){
            $cordovaScanning.commont("devices", "").then(function (data) {
                $ionicLoading.show();
                vm.uuid  = data;
                WelcomeService.isHavePattern(vm.uuid).success(function (data) {
                    localStorage.setItem('userPortrait',data.userPortrait);
                    if(data.havePattern){
                        $ionicNativeTransitions.stateGo(state, params, {}, {
                            "type": "slide",
                            "direction": "right"
                        });
                        return false;
                    }else {
                        $ionicNativeTransitions.stateGo('login', params, {}, {
                            "type": "slide",
                            "direction": "right"
                        });
                        return false;
                    }
                }).error(function (error) {
                }).finally(function () {
                    $ionicLoading.hide();
                });

            });
            } else {
                $ionicNativeTransitions.stateGo('tab.product-roll-in', {tradeType:vm.tradeType, subAccountType:vm.subAccountType}, {
                    "type": "slide",
                    "direction": "right"
                });
            }
        }

        /*
        * 上拉加载
        * */
        $scope.dt1 = new Date();
        loadMore();
        function  loadMore() {
            ProductService.rollLoadMore(vm.page.currentPage, vm.page.itemsPerPage, vm.criteria)
                .success(function (data) {
                    vm.moerv = data;
                    if(vm.moerv.list.length == 0){
                        vm.hasMoreData = false;
                    }else {
                        angular.forEach(vm.moerv.list, function (item) {
                            vm.items.push(item);
                        });
                        vm.page.currentPage++;
                        if (vm.moerv.list.length < vm.page.itemsPerPage) {
                            vm.hasMoreData = false;
                        } else {
                            vm.hasMoreData = true;
                        }
                    }
                })
                .error(function (error) {
                    vm.hasMoreData = false;
                }).finally(function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

    }
})();