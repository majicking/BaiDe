(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['$rootScope', '$sessionStorage', '$scope', '$localStorage', '$ionicLoading', '$ionicPopup', '$ionicNativeTransitions', 'AccountService', '$cordovaScanning', 'UserService'];
    function AccountCtrl($rootScope, $sessionStorage, $scope, $localStorage, $ionicLoading, $ionicPopup, $ionicNativeTransitions, AccountService, $cordovaScanning, UserService) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.model = {
            amount1:'0.00',
            amount2:'0.00',
            amount3:'0.00',
            amount4:'0.00',
            name1:'加载中...',
            name2:'加载中...',
            name3:'加载中...',
            name4:'加载中...',
            lastNote:'加载中...',
            lastAmount:'加载中...',
            lastExecuteTime:'加载中...',
            lastAccountName:'加载中...',
            resultText:'加载中...',
            username:$rootScope.userInfo.username,
            name:$rootScope.userInfo.name,
            userType:$rootScope.userInfo.userType,
            isQiYe:$rootScope.userInfo.isQiYe,
            isTrustName:$rootScope.userInfo.isTrustName,
            grade:$rootScope.userInfo.grade,
            imgAddr:$rootScope.userInfo.imgAddr,
            subAccountTypeList:$rootScope.userInfo.subAccountTypeList
        }

        vm.flag = JSON.parse(localStorage.getItem(vm.userId));
        if (vm.flag == null) {
            vm.flag = true;
            localStorage.setItem(vm.userId, JSON.stringify(vm.flag));
        }

        vm.getAsset = getAsset;
        vm.doRefresh = doRefresh;
        vm.display = display;
        vm.build = build;
        vm.scanner = scanner;
        vm.iconfontStyle = iconfontStyle;


        vm.getAsset();

        //扫描
        function scanner(){
            $cordovaScanning.commont("scanner", "").then(function (ssuc) {
                $ionicLoading.show();
                UserService.checkUserCode(ssuc).success(function (data) {
                    $ionicLoading.hide();
                    if(data.userCodeIsWork){
                        $ionicNativeTransitions.stateGo('tab.account-transfer', { subAccountType:'0017', username:data.username, ComeUrl:'tab.account' }, {}, {
                            "type": "slide",
                            "direction": "down"
                        });
                    }else{
                        $scope.$emit('alertWarning', '不是有效二维码');
                    }
                }).error(function (error) {
                    $scope.$emit('alertWarning', '数据取得失败');
                }).finally(function(error){
                    $ionicLoading.hide();
                })
            },function (error) {
                $scope.$emit('alertWarning', error);
            })
        }
        function iconfontStyle(i) {
            var style = { };
            if(i == 1){
                style = {
                    'font-size':'27px !important'
                }
            }else if(i == 3 || i == 4){
                style = {
                    'font-size':'26px !important'
                }
            }
            return style;
        }

        function popup(notice) {
            if (!$localStorage.notice) {
                $localStorage.notice = {
                    id: null
                }
            }
            if (notice != null && $localStorage.notice.id < notice.id) {
                var confirmPopup = $ionicPopup.confirm({
                    title: '最新公告',
                    template: '<div class="text-center">' + notice.title + '</div>',
                    cancelText: '稍后查看',
                    okText: '立即查看'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $ionicNativeTransitions.stateGo('tab.notice-list-notice', {id: notice.id}, {}, {
                            "type": "slide",
                            "direction": "right"
                        });
                    }
                });
                $localStorage.notice.id = notice.id;
            }
        }

        function getAsset() {
            $ionicLoading.show();
            AccountService.getAsset(
                vm.userId,
                ''
            ).success(function (data) {
                vm.model = data;
                vm.model.subAccountTypeList = data.subAccountTypeList.list;
                vm.model.subAccountTypeListDisplay = data.subAccountTypeListDisplay.list;

                vm.model.amount1 = vm.model.subAccountTypeAmountText1.split(':')[0];
                vm.model.name1 = vm.model.subAccountTypeAmountText1.split(':')[1] + '总额';

                vm.model.amount2 = vm.model.subAccountTypeAmountText2.split(':')[0];
                vm.model.name2 = vm.model.subAccountTypeAmountText2.split(':')[1] + '总额';

                vm.model.amount3 = vm.model.subAccountTypeAmountText3.split(':')[0];
                vm.model.name3 = vm.model.subAccountTypeAmountText3.split(':')[1] + '总额';

                vm.model.amount4 = vm.model.subAccountTypeAmountText4.split(':')[0];
                vm.model.name4 = vm.model.subAccountTypeAmountText4.split(':')[1] + '总额';

                vm.model.amount5 = vm.model.subAccountTypeAmountText5.split(':')[0];
                // vm.model.name5 = vm.model.subAccountTypeAmountText5.split(':')[1].substring(0,1)+ ' ' + vm.model.subAccountTypeAmountText5.split(':')[1].substring(1,2) + ' ' + vm.model.subAccountTypeAmountText5.split(':')[1].substring(2,3) + ' 张 数';
                vm.model.name5 = vm.model.subAccountTypeAmountText5.split(':')[1]+'总额';

                vm.model.amount6 = vm.model.subAccountTypeAmountText6.split(':')[0];
                vm.model.name6 = vm.model.subAccountTypeAmountText6.split(':')[1] + '总额';

                vm.model.amount7 = vm.model.subAccountTypeAmountText7.split(':')[0];
                vm.model.name7 = vm.model.subAccountTypeAmountText7.split(':')[1] + '总额';

                vm.model.amount8 = vm.model.subAccountTypeAmountText8.split(':')[0];
                vm.model.name8 = vm.model.subAccountTypeAmountText8.split(':')[1] + '总额';

                if (vm.model.lastAmountText!=undefined) {
                    vm.model.lastNote = vm.model.lastAmountText.split(':')[1];
                    vm.model.lastAmount = vm.model.lastAmountText.split(':')[0];
                    vm.model.lastExecuteTime = vm.model.lastAmountText.split(':')[3];
                    vm.model.lastAccountName = vm.model.lastAmountText.split(':')[4];
                } else {
                    vm.model.resultText = '亲~，暂无动态，快来参与吧！';
                }

                $rootScope.userInfo.username = $sessionStorage.userInfo.username = vm.model.username;
                $rootScope.userInfo.name = $sessionStorage.userInfo.name = vm.model.name;
                $rootScope.userInfo.userType = $sessionStorage.userInfo.userType = vm.model.userType;
                $rootScope.userInfo.grade = $sessionStorage.userInfo.grade = vm.model.grade;
                $rootScope.userInfo.isQiYe = $sessionStorage.userInfo.isQiYe = vm.model.isQiYe;
                $rootScope.userInfo.isTrustName = $sessionStorage.userInfo.isTrustName = vm.model.isTrustName;
                $rootScope.userInfo.imgAddr = $sessionStorage.userInfo.imgAddr = vm.model.imgAddr;
                $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = vm.model.subAccountTypeList;

                popup(vm.model.notice);
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function doRefresh() {
            AccountService.getAsset(
                vm.userId,
                ''
            ).success(function (data) {
                vm.model = data;
                vm.model.subAccountTypeList = data.subAccountTypeList.list;
                vm.model.subAccountTypeListDisplay = data.subAccountTypeListDisplay.list;

                vm.model.amount1 = vm.model.subAccountTypeAmountText1.split(':')[0];
                vm.model.name1 = vm.model.subAccountTypeAmountText1.split(':')[1] + '总额';

                vm.model.amount2 = vm.model.subAccountTypeAmountText2.split(':')[0];
                vm.model.name2 = vm.model.subAccountTypeAmountText2.split(':')[1] + '总额';

                vm.model.amount3 = vm.model.subAccountTypeAmountText3.split(':')[0];
                vm.model.name3 = vm.model.subAccountTypeAmountText3.split(':')[1] + '总额';

                vm.model.amount4 = vm.model.subAccountTypeAmountText4.split(':')[0];
                vm.model.name4 = vm.model.subAccountTypeAmountText4.split(':')[1] + '总额';

                vm.model.amount5 = vm.model.subAccountTypeAmountText5.split(':')[0];
                // vm.model.name5 = vm.model.subAccountTypeAmountText5.split(':')[1].substring(0,1)+ ' ' + vm.model.subAccountTypeAmountText5.split(':')[1].substring(1,2) + ' ' + vm.model.subAccountTypeAmountText5.split(':')[1].substring(2,3) + ' 张 数';
                vm.model.name5 = vm.model.subAccountTypeAmountText5.split(':')[1]+'总额';

                vm.model.amount6 = vm.model.subAccountTypeAmountText6.split(':')[0];
                vm.model.name6 = vm.model.subAccountTypeAmountText6.split(':')[1] + '总额';

                vm.model.amount7 = vm.model.subAccountTypeAmountText7.split(':')[0];
                vm.model.name7 = vm.model.subAccountTypeAmountText7.split(':')[1] + '总额';

                vm.model.amount8 = vm.model.subAccountTypeAmountText8.split(':')[0];
                vm.model.name8 = vm.model.subAccountTypeAmountText8.split(':')[1] + '总额';

                if (vm.model.lastAmountText!=undefined) {
                    vm.model.lastNote = vm.model.lastAmountText.split(':')[1];
                    vm.model.lastAmount = vm.model.lastAmountText.split(':')[0];
                    vm.model.lastExecuteTime = vm.model.lastAmountText.split(':')[3];
                    vm.model.lastAccountName = vm.model.lastAmountText.split(':')[4];
                } else {
                    vm.model.resultText = '亲~，暂无动态，快来参与吧！';
                }

                $rootScope.userInfo.username = $sessionStorage.userInfo.username = vm.model.username;
                $rootScope.userInfo.name = $sessionStorage.userInfo.name = vm.model.name;
                $rootScope.userInfo.userType = $sessionStorage.userInfo.userType = vm.model.userType;
                $rootScope.userInfo.grade = $sessionStorage.userInfo.grade = vm.model.grade;
                $rootScope.userInfo.isQiYe = $sessionStorage.userInfo.isQiYe = vm.model.isQiYe;
                $rootScope.userInfo.isTrustName = $sessionStorage.userInfo.isTrustName = vm.model.isTrustName;
                $rootScope.userInfo.imgAddr = $sessionStorage.userInfo.imgAddr = vm.model.imgAddr;
                $rootScope.userInfo.subAccountTypeList = $sessionStorage.userInfo.subAccountTypeList = vm.model.subAccountTypeList;
            }).error(function (error) {
            }).finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }

        //可见/不可见
        function display() {
            vm.flag = JSON.parse(localStorage.getItem(vm.userId));
            if (vm.flag) {
                localStorage.setItem(vm.userId, JSON.stringify(false));
                vm.flag = false;
            } else {
                localStorage.setItem(vm.userId, JSON.stringify(true));
                vm.flag = true;
            }
        }

        function build() {
            $scope.$emit('alertWarning', '功能正在建设中');
        }
    }
})();