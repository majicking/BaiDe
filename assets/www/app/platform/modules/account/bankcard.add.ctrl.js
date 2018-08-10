/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('BankCardAddCtrl', BankCardAddCtrl);

    BankCardAddCtrl.$inject = ['$rootScope','$scope', '$ionicNativeTransitions', '$stateParams', '$ionicLoading', '$sessionStorage', 'BankCardService'];
    function BankCardAddCtrl($rootScope,$scope, $ionicNativeTransitions, $stateParams, $ionicLoading, $sessionStorage, BankCardService) {
        var vm = this;
        vm.showPage = false;
        vm.userId = $rootScope.userInfo.userId;
        vm.ComeUrl = $stateParams.ComeUrl;
        vm.model = {
            bankCard:'',
            province:null,
            city:null,
            bankCode:null,
            bankInfoId:null
        };

        vm.bankList = [];
        vm.provinceList = [];
        vm.cityList = [];
        vm.bankInfoList = [];
        vm.name = null;
        vm.card = null;

        //vm.disabled = true;

        //vm.bankCardChanged = bankCardChanged;
        vm.addBankCard = addBankCard;
        vm.inputCard = inputCard;
        vm.bankChanged = bankChanged;
        vm.provinceChanged = provinceChanged;
        vm.cityChanged = cityChanged;

        getBindBankInfo();

        //function bankCardChanged(){
        //    var reg = /^(\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20})$/;
        //    var tempCard = vm.model.bankCard.replace(/\s/g,'');
        //    if(!reg.test(tempCard)){
        //        vm.disabled = true;
        //    } else {
        //        vm.disabled = false;
        //    }
        //}

        function inputCard(){
            vm.model.bankCard = vm.model.bankCard.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
            //bankCardChanged();
        }

        function getBindBankInfo(){
            $ionicLoading.show();
            BankCardService.getBindBankInfo(vm.userId)
                .success(function (data) {
                    vm.name = data.realName;
                    vm.bankList = data.bankList;
                    vm.provinceList = data.provinceList;
                }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }

        function bankChanged(){
            $ionicLoading.show();
            BankCardService.getProvinceList(vm.model.bankCode)
                .success(function (data) {
                    vm.provinceList = data;
                }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }

        function provinceChanged(){
            $ionicLoading.show();
            BankCardService.getCityList(vm.model.bankCode,vm.model.province)
                .success(function (data) {
                    vm.cityList = data;
                }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }

        function cityChanged(){
            $ionicLoading.show();
            BankCardService.getBankInfoList(vm.model.bankCode,vm.model.city)
                .success(function (data) {
                    vm.bankInfoList = data;
                }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }

        function addBankCard(){
            if(vm.model.bankCard == null
                || $.trim(vm.model.bankCard) == ''){
                $scope.$emit('alertWarning', '请填写卡号');
                return;
            }

            var reg = /^(\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20})$/;
            var tempCard = vm.model.bankCard.replace(/\s/g,'');
            if(!reg.test(tempCard)){
                $scope.$emit('alertWarning', '请填写正确的卡号');
                return;
            }

            if(vm.model.bankCode==null){
                $scope.$emit('alertWarning', '请选择所属银行');
                return;
            }

            if(vm.model.province==null){
                $scope.$emit('alertWarning', '请选择开户行所在省');
                return;
            }

            if(vm.model.city==null){
                $scope.$emit('alertWarning', '请选择开户行所在市');
                return;
            }

            if(vm.model.bankInfoId==null){
                $scope.$emit('alertWarning', '请选择开户行网点');
                return;
            }

            $ionicLoading.show();
            vm.model.bankCard = tempCard;
            vm.model.userId = vm.userId;
            BankCardService.addBankCard(vm.model)
            .success(function (data) {
                $rootScope.userInfo.isNomalBank = $sessionStorage.userInfo.isNomalBank = data;
                if(vm.ComeUrl=="payment"){
                    $ionicNativeTransitions.stateGo('tab.account', {}, {}, {
                        "type": "slide",
                        "direction": "right"
                    });
                }else {
                    $ionicNativeTransitions.stateGo('tab.manage-bankcard-list', {}, {}, {
                        "type": "slide",
                        "direction": "right"
                    });
                }
            }).error(function(){
            }).finally(function() {
                $ionicLoading.hide();
            });
        }
    }
})();

