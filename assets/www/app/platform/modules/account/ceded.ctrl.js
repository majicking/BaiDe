(function () {
    'use strict';

    angular.module('app').controller('CededCtrl', CededCtrl);
    CededCtrl.$inject = ['$rootScope', '$scope', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService', 'UserService', '$stateParams'];
    function CededCtrl($rootScope, $scope , $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService, UserService, $stateParams) {
        var vm = this;
        vm.subAccountType = $stateParams.subAccountType;
        vm.id = $stateParams.id;
        vm.userId = $rootScope.userInfo.userId;

        vm.model = {};

        angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
            if (item.value == vm.subAccountType) {
                vm.model.subAccountTypeText = item.text;
                return;
            }
        });

        vm.input = {
            toUsername : '',
            payPassword : '',
            cededSessionToken: void 0
        };

        vm.disabled = true;

        vm.usernameChanged = usernameChanged;
        vm.confirm = confirm;

        $scope.visible = false;
        $scope.moreToggle = function(){
            $scope.visible = !$scope.visible;
        }

        getCededInfo();

        function getCededInfo() {
            $ionicLoading.show();
            AccountService.getCededInfo(
                vm.userId,
                vm.id != null ? vm.id : 0,
                vm.subAccountType
            ).success(function (data) {
                vm.model = data;
                angular.forEach($rootScope.userInfo.subAccountTypeList, function (item) {
                    if (item.value == vm.subAccountType) {
                        item.text = vm.model.subAccountTypeText;
                        return;
                    }
                });
                vm.input.cededSessionToken = data.cededSessionToken;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            })
        }

        function usernameChanged() {
            var re = /^[A-Za-z0-9\u4e00-\u9fa5_-]+$/;
            if (!re.test(vm.input.toUsername)) {
                vm.disabled = true;
            } else {
                vm.disabled = false;
            }
        }

        function confirm() {
            if (vm.id == null) {
                $scope.$emit('alertWarning', '请选择转让股本对象');
            } else if ((vm.input.toUsername == null
                || $.trim(vm.input.toUsername) == '')) {
                $scope.$emit('alertWarning', '请输入转让对方账户');
            } else if ((vm.input.toUsername == vm.model.username)) {
                $scope.$emit('alertWarning', '转让对方账户不能为自己');
            } else if (vm.input.payPassword == null
                || $.trim(vm.input.payPassword) == '') {
                $scope.$emit('alertWarning', '请输入交易密码');
            } else {
                $ionicLoading.show();
                UserService.validateUsername(
                    vm.input.toUsername
                ).success(function (message) {
                    if(message.code==1){
                        var confirmPopup = $ionicPopup.confirm({
                            title: '确认',
                            template: '<div class="text-center">您的转让对象是'+message.data+'?</div>',
                            cancelText: '否',
                            okText: '是'
                        });
                        confirmPopup.then(function(res) {
                            if(res) {
                                $ionicLoading.show();
                                vm.input.checkCode = vm.model.checkCode;
                                vm.input.userId = vm.userId;
                                vm.input.subAccountType = vm.subAccountType;
                                vm.input.id = vm.id;
                                AccountService.ceded(
                                    vm.input
                                ).success(function (data) {
                                    $ionicNativeTransitions.stateGo('tab.account-ceded-result', {
                                        id: data,
                                        subAccountType: vm.subAccountType,
                                        back: 'account'
                                    }, {}, {
                                        "type": "slide",
                                        "direction": "right"
                                    });
                                }).error(function (error) {
                                }).finally(function () {
                                    $ionicLoading.hide();
                                })
                            }
                        });
                    }else{
                        $scope.$emit('alertWarning', message.message);
                    }
                }).error(function (error) {
                    vm.aaa = 'aaa';
                }).finally (function(){
                    $ionicLoading.hide();
                });
            }
        }
    }

    function sub(num1,num2){
        var r1,r2, m,n;
        try{
            r1 = num1.toString().split('.')[1].length;
        }catch(e){
            r1 = 0;
        }
        try{
            r2=num2.toString().split(".")[1].length;
        }catch(e){
            r2=0;
        }
        m=Math.pow(10,Math.max(r1,r2));
        n=(r1>=r2)?r1:r2;
        return (Math.round(num1*m-num2*m)/m).toFixed(n);
    }
})();