/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('MemberGraphCtrl', MemberGraphCtrl);

    MemberGraphCtrl.$inject = ['$scope', '$rootScope', '$sessionStorage', '$state', '$ionicPopup', '$ionicLoading', 'AccountService'];
    function MemberGraphCtrl($scope, $rootScope, $sessionStorage, $state, $ionicPopup, $ionicLoading, AccountService) {
        var vm = this;
        $scope.data = {};
        vm.showPage = true;
        vm.username = $rootScope.userInfo.username;
        vm.userId = $rootScope.userInfo.userId;

        vm.criteria = {
            username: null
        }

        vm.stack = [];

        vm.tree = {};
        vm.clickNode = clickNode;
        vm.search = search;
        vm.goBack = goBack;

        //vm.isEnglish = false;
        vm.tradesHtml = '';
        vm.paymentHtml = '';
        vm.checkCodeArr = [];

        getMemberGraph(vm.username, true);
        getTradesHtml();
        getPaymentHtml();

        function getTradesHtml() {
            AccountService.getTrades(1, 20, {biz: 1}
            ).success(function (data) {
                var tradeHtml = '';
                angular.forEach(data.list, function (item) {
                    tradeHtml = tradeHtml + '<option value="' + item.id + '">' + item.name + '</option>';
                });
                vm.tradesHtml = tradeHtml;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function getPaymentHtml() {
            AccountService.getPayment(
            ).success(function (data) {
                var paymentHtml = '';
                angular.forEach(data, function (item) {
                    paymentHtml = paymentHtml + '<option value="' + item.type + '">' + item.payName + '</option>';
                });
                vm.paymentHtml = paymentHtml;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function goBack() {
            vm.stack.splice(vm.stack.length - 1, vm.stack.length);
            var username = vm.stack[vm.stack.length - 1];
            $ionicLoading.show();
            AccountService.getMemberGraph(
                vm.username,
                username
            ).success(function (data) {
                vm.tree = data;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function search() {
            if (vm.criteria.username) {
                var username = vm.criteria.username;
                getMemberGraph(username, true);
                vm.criteria = {
                    username: null
                }
            }
        }

        function getMemberGraph(username, isPush) {
            $ionicLoading.show();
            AccountService.getMemberGraph(
                vm.username,
                username
            ).success(function (data) {
                if (data) {
                    if (isPush) {
                        vm.stack.push(username);
                    }
                    vm.tree = data;
                }
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        // 根据支付方式获取 checkCode
        $scope.checkCode = checkCode;

        function checkCode(payTypeId) {
            AccountService.getCheckCodeStrsByPayType(payTypeId,vm.userId)
                .success(function (data) {
                    vm.checkCodeArr = data.checkCodeStrs;
            }).error(function (error) {
            }).finally(function () {
                $ionicLoading.hide();
            });
        }

        function clickNode(topMember, member, graphType, token, dbCheckCode, ndlCheckCode) {
            if (topMember != null && topMember.activeTime != null) {
                if (null == member) {
                    var re = '';
                    vm.showConfirm = function () {
                        $ionicPopup.show({
                            template: '<div class="list">'
                            + '<label class="item item-input item-select">'
                            + '<div class="input-label" style="font-weight: bold;font-size: 14px;">配套</div>'
                            + '<select ng-model="data.supportType">'
                            + '<option value="">请选择</option>'
                            + vm.tradesHtml
                            + '</select>'
                            + '</label>'
                            + '<label class="item item-input item-select">'
                            + '<div class="input-label" style="font-weight: bold;font-size: 14px;">支付方式</div>'
                            + '<select ng-model="data.payType" ng-change="checkCode(data.payType)">'
                            + '<option value="">请选择</option>'
                            + vm.paymentHtml
                            + '</select>'
                            + '</label>'
                            + '<div class="item">'
                            + '<label style="font-weight: bold;font-size: 14px;">推&nbsp;&nbsp;荐&nbsp;&nbsp;人</label>'
                            + '<input class="item-account" ng-model="data.referrer" style="float:right;border:0;width:70%;padding-left: 10px;" maxlength="11" placeholder="请输入推荐人账号" />'
                            + '</div>'
                            + '<div class="item">'
                            + '<label style="font-weight: bold;font-size: 14px;">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</label>'
                            + '<input class="item-account" ng-model="data.username" style="float:right;border:0;width:70%;padding-left: 10px;" maxlength="5" placeholder="请输入用户名" />'
                            + '</div>'
                            + '<div class="item">'
                            + '<label style="font-weight: bold;font-size: 14px;" >密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</label>'
                            + '<input class="item-password" ng-model="data.password" type="password" style="float:right;border:0;width:70%;padding-left: 10px;" placeholder="请输入密码" />'
                            + '</div>'
                            + '<div class="item" style="margin-top: 15px;">'
                            + '<label style="font-weight: bold;font-size: 14px;" >交易密码</label>'
                            + '<input class="item-password" ng-model="data.payPwd" type="password" style="float:right;border:0;width:70%;padding-left: 10px;" placeholder="请输入己方交易密码" />'
                            + '</div>'
                            + '</div>',
                            title: '是否生成账号',
                            scope: $scope,
                            buttons: [
                                {
                                    text: '确定',
                                    type: 'button-balanced botton-radius',
                                    onTap: function (e) {
                                        if (!$scope.data.supportType) {
                                            $scope.$emit('alertWarning', '请选择配套');
                                            return;
                                        } else if (!$scope.data.payType) {
                                            $scope.$emit('alertWarning', '请选择支付方式');
                                            return;
                                        } else if (!$scope.data.referrer) {
                                            $scope.$emit('alertWarning', '请输入推荐人');
                                            return;
                                        } else if (!$scope.data.username) {
                                            $scope.$emit('alertWarning', '请输入账号');
                                            return;
                                        } else if (!$scope.data.password) {
                                            $scope.$emit('alertWarning', '请输入密码');
                                            return;
                                        } else if (!$scope.data.payPwd) {
                                            $scope.$emit('alertWarning', '请输入交易密码');
                                            return;
                                        } else {
                                            re = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w!#$%^&*.~]{6,22}$/;
                                            if (!re.test($scope.data.password)) {
                                                $scope.$emit('alertWarning', '密码要求长度在6-22位字符之间，至少包含数字、字母(区分大小写)、符号(!#$%^&*.~)中的2种');
                                                return;
                                            } else {
                                                // var re=/^(?!\d+$)[\da-zA-Z\u4e00-\u9fa5]{1,6}$|^(?!\d+$)[\da-zA-Z]{1,12}$/;
                                                re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,5}$/;
                                                if (!re.test($scope.data.username)) {
                                                    $scope.$emit('alertWarning', '账号请输入数字和英文长度为5个字符,不能为纯数字纯英文');
                                                    return;
                                                }

                                                $ionicLoading.show();
                                                var model = {
                                                    graphId: topMember.id,
                                                    graphType: graphType,
                                                    tradeType: $scope.data.supportType,
                                                    payType: $scope.data.payType,
                                                    memberId: $sessionStorage.userInfo.userId,
                                                    username: $scope.data.username,
                                                    password: $scope.data.password,
                                                    payPwd: $scope.data.payPwd,
                                                    bdcheckCode: dbCheckCode,
                                                    checkCode: ndlCheckCode,
                                                    investmentType: 0,
                                                    activeBalanceSessionToken: token,
                                                    checkCodeStrs:vm.checkCodeArr,
                                                    referrer:$scope.data.referrer
                                                };
                                                AccountService.generate(model)
                                                    .success(function (data) {
                                                        var username = vm.stack[vm.stack.length - 1];
                                                        getMemberGraph(username, false);
                                                        $state.reload('tab.manage-member-graph');
                                                    })
                                                    .error(function (error) {
                                                    })
                                                    .finally(function () {
                                                        $ionicLoading.hide();
                                                    });
                                            }
                                        }
                                    }
                                },
                                {
                                    text: '取消',
                                    type: 'button-org botton-radius'
                                },
                            ]
                        });
                        /*var confirmPopup = $ionicPopup.confirm({
                         title: '确认',
                         subTitle: '是否生成账号？',
                         template: ''
                         +'<div class="list">'
                         +'<label class="item item-input item-select">'
                         +'<div class="input-label">配套</div>'
                         +'<select ng-model="data.supportType">'
                         +'<option value="">请选择</option>'
                         // +'<option value="01" translate="invest.money_1"></option>'
                         // +'<option value="02" translate="invest.money_2"></option>'
                         // +'<option value="03" translate="invest.money_3"></option>'
                         + vm.tradesHtml
                         +'</select>'
                         +'</label>'
                         +'<div class="item">'
                         +'<label style="font-weight: bold;font-size: 16px;">账号</label>'
                         +'<input class="item-account" ng-model="data.username" style="float:right;border:0;" placeholder="用户名/手机号" />'
                         +'</div>'
                         +'<div class="item">'
                         +'<label style="font-weight: bold;font-size: 16px;">密码</label>'
                         +'<input class="item-password" ng-model="data.password" type="password" style="float:right;border:0;" />'
                         +'</div>'
                         +'</div>',
                         scope: $scope,
                         buttons: [
                         { text: '否'},
                         {
                         text:  '是',
                         type: 'button-positive',
                         onTap: function(e) {
                         if (!$scope.data.supportType) {
                         $scope.$emit('alertWarning', '请选择配套');
                         return;
                         }else if (!$scope.data.username){
                         $scope.$emit('alertWarning', '请输入账号');
                         return;
                         }else if(!$scope.data.password){
                         $scope.$emit('alertWarning', '请输入密码');
                         return;
                         }else {
                         // var re = /^\w{3,5}$/;
                         var re=/^(?!\d+$)[\da-zA-Z\u4e00-\u9fa5]{1,6}$|^(?!\d+$)[\da-zA-Z]{1,12}$/;
                         if (!re.test($scope.data.username)) {
                         $scope.$emit('alertWarning', '账号格式不正确');
                         return;
                         }

                         $ionicLoading.show();
                         var model = {
                         graphId:topMember.id,
                         graphType: graphType,
                         supportType:$scope.data.supportType,
                         referralId:$rootScope.userInfo.memberId,
                         username:$scope.data.username,
                         password:$scope.data.password
                         //isEnglish:0
                         };
                         // AccountService.generate(model)
                         //     .success(function (data) {
                         //         var username = vm.stack[vm.stack.length-1];
                         //         getMemberGraph(username,false);
                         //     })
                         //     .error(function (error) {
                         //     })
                         //     .finally (function(){
                         //         $ionicLoading.hide();
                         //     });
                         }
                         }
                         }
                         ]
                         })*/
                    };
                    vm.showConfirm();
                } else {
                    getMemberGraph(member.username, true);
                }
            }
        }
    }
})();

