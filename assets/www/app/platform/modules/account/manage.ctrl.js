/**
 * Created by lifeng on 2016/1/20.
 */
(function () {
    'use strict';

    /* Controllers */
    angular.module('app').controller('ManageCtrl', ManageCtrl);

    ManageCtrl.$inject = ['$window','$rootScope', '$scope', '$ionicLoading', '$sessionStorage', '$ionicNativeTransitions', 'AccountService', 'MstrService', 'UploadService', '$ionicPopup'];
    function ManageCtrl($window,$rootScope, $scope, $ionicLoading, $sessionStorage, $ionicNativeTransitions, AccountService, MstrService, UploadService, $ionicPopup) {
        var vm = this;
        vm.userId = $rootScope.userInfo.userId;

        vm.flag = false;
        vm.memberBill = false;
        vm.model = {
            username: $rootScope.userInfo.username,
            name: $rootScope.userInfo.name,
            userType: $rootScope.userInfo.userType,
            isQiYe: $rootScope.userInfo.isQiYe,
            isNomalBank: $rootScope.userInfo.isNomalBank,
            isEntBank: $rootScope.userInfo.isEntBank,
            bankUsed: $rootScope.userInfo.bankUsed,
            isMobile: $rootScope.userInfo.isMobile,
            mobile: $rootScope.userInfo.mobile,
            referralName: $rootScope.userInfo.referralName,
            idCard: $rootScope.userInfo.idCard,
            grade: $rootScope.userInfo.grade,
            imgAddr: $rootScope.userInfo.imgAddr,
            bizCredentialName: $rootScope.userInfo.bizCredentialName,
            bizCredentialNo: $rootScope.userInfo.bizCredentialNo,
            bizLicenseNo: $rootScope.userInfo.bizLicenseNo
        };

        if (vm.model.bankUsed != null) {
            vm.bankTypeValue = vm.model.bankUsed.split(':')[0];
            vm.bankTypeText = vm.model.bankUsed.split(':')[1];
        } else {
            vm.bankTypeValue = null;
            vm.bankTypeText = null;
        }

        //vm.refreshUser = refreshUser;

        vm.logout = logout;
        vm.toOrder = toOrder;
        vm.imgUpload = imgUpload;
        vm.display = display;
        vm.typeChanged = typeChanged;
        vm.getAccountInfo = getAccountInfo;
        vm.getMasterList = getMasterList;
        vm.functionConstruction = functionConstruction;
        vm.getMemberIsDeclaration = getMemberIsDeclaration;
        vm.applyForDeclaration = applyForDeclaration;
        var imgUploader = $scope.imgUploader = UploadService.init(1);
        /*listUploader.removeAfterUpload = true;*/

        imgUploader.onAfterAddingFile = function (item) {
            imgUploader.uploadItem(item);
        };

        imgUploader.onSuccessItem = function (fileItem, response, status, headers) {
            vm.model.imgAddr = response.data.url;
            imgUploader.clearQueue();
            vm.imgUpload();
        };

        imgUploader.onErrorItem = function (fileItem, response, status, headers) {
            $scope.$emit("error", "错误", '系统忙，请重新上传');
            imgUploader.clearQueue();
        };


        //$scope.imgChange = function (element) {
        //    if (!element.files[0]) {
        //        console.log("未选择图片！");
        //        return;
        //    }
        //    $scope.$apply(function(scope) {
        //        var photofile = element.files[0];
        //        var reader = new FileReader();
        //        reader.onload = function(e) {
        //            var prev_img = document.getElementById("face");
        //            prev_img.src = e.target.result;
        //            console.log(prev_img.src.length);
        //            $scope.userInfo.headImage = reduceImage.compress(prev_img, 50).src;
        //            console.log($scope.userInfo.headImage);
        //            console.log($scope.userInfo.headImage.length);
        //        };
        //        reader.readAsDataURL(photofile);
        //    });
        //};
        //
        //
        //var reduceImage = {
        //    /**
        //     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
        //     * @param {Image} source_img_obj The source Image Object
        //     * @param {Integer} quality The output quality of Image Object
        //     * @return {Image} result_image_obj The compressed Image Object
        //     */
        //    compress: function(source_img_obj, quality, output_format){
        //        var mime_type = "image/jpeg";
        //        if(output_format!=undefined && output_format=="png"){
        //            mime_type = "image/png";
        //        }
        //        var cvs = document.createElement('canvas');
        //        //naturalWidth真实图片的宽度
        //        //cvs.width = source_img_obj.naturalWidth;
        //        //cvs.height = source_img_obj.naturalHeight;
        //        var xRate = 100 / source_img_obj.naturalWidth;
        //        var yRate = 100 / source_img_obj.naturalHeight;
        //        cvs.width = 100;
        //        cvs.height = 100;
        //        var cvsContext = cvs.getContext('2d');
        //        cvsContext.scale(xRate, yRate);
        //        var ctx = cvsContext.drawImage(source_img_obj, 0, 0);
        //        var newImageData = cvs.toDataURL(mime_type, quality/100);
        //        var result_image_obj = new Image();
        //        result_image_obj.src = newImageData;
        //        return result_image_obj;
        //    }
        //};

        getMasterList('BANK_TYPE');

        getAccountInfo();

        function getAccountInfo() {
            $ionicLoading.show();
            AccountService.getAccountInfo(
                vm.userId
            ).success(function (data) {
                vm.model = data;
                $rootScope.userInfo.username = $sessionStorage.userInfo.username = vm.model.username;
                $rootScope.userInfo.name = $sessionStorage.userInfo.name = vm.model.name;
                $rootScope.userInfo.userType = $sessionStorage.userInfo.userType = vm.model.userType;
                $rootScope.userInfo.isQiYe = $sessionStorage.userInfo.isQiYe = vm.model.isQiYe;
                $rootScope.userInfo.isNomalBank = $sessionStorage.userInfo.isNomalBank = vm.model.isNomalBank;
                $rootScope.userInfo.isEntBank = $sessionStorage.userInfo.isEntBank = vm.model.isEntBank;
                $rootScope.userInfo.bankUsed = $sessionStorage.userInfo.bankUsed = vm.model.bankUsed;
                $rootScope.userInfo.isMobile = $sessionStorage.userInfo.isMobile = vm.model.isMobile;
                $rootScope.userInfo.mobile = $sessionStorage.userInfo.mobile = vm.model.mobile;
                $rootScope.userInfo.referralName = $sessionStorage.userInfo.referralName = vm.model.referralName;
                $rootScope.userInfo.idCard = $sessionStorage.userInfo.idCard = vm.model.idCard;
                $rootScope.userInfo.grade = $sessionStorage.userInfo.grade = vm.model.grade;
                $rootScope.userInfo.imgAddr = $sessionStorage.userInfo.imgAddr = vm.model.imgAddr;
                $rootScope.userInfo.bizCredentialName = $sessionStorage.userInfo.bizCredentialName = vm.model.bizCredentialName;
                $rootScope.userInfo.bizCredentialNo = $sessionStorage.userInfo.bizCredentialNo = vm.model.bizCredentialNo;
                $rootScope.userInfo.bizLicenseNo = $sessionStorage.userInfo.bizLicenseNo = vm.model.bizLicenseNo;
            }).error(function (error) {
            }).finally(function (error) {
                $ionicLoading.hide();
            });
        }

        function imgUpload() {
            $ionicLoading.show();
            AccountService.imgUpload(
                vm.userId,
                vm.model.imgAddr
            ).success(function (data) {
                $rootScope.userInfo.imgAddr = $sessionStorage.userInfo.imgAddr = vm.model.imgAddr;
            }).error(function (error) {
            }).finally(function (error) {
                $ionicLoading.hide();
            });
        }

        function toOrder() {
            $ionicNativeTransitions.stateGo('tab.manage-order', {}, {}, {
                "type": "slide",
                "direction": "right"
            });
        }

        getMemberIsDeclaration();
        function getMemberIsDeclaration() {//初始化判断是否报单
            AccountService.getMemberIsDeclaration(
                vm.userId
            ).success(function (data) {
                if (data.grade == "01") {//报单中心
                    vm.memberBill = true;
                    // vm.memberBill = false;
                } else {//普通用户
                    vm.memberBill = false;
                }
            }).error(function (error) {
            }).finally(function (error) {
                $ionicLoading.hide();
            });
        }

        function applyForDeclaration() {//普通用户申请报单
            $ionicPopup.show({
                title: '<div class="f f-ac f-c">是否确认申请？</div>',
                template: '',
                buttons: [
                    {
                        text: '确定',
                        type: 'button-balanced botton-radius',
                        onTap: function (e) {
                            AccountService.getApplyForDeclaration(
                                vm.userId
                            ).success(function (data) {
                                if (data.code == 30205) {
                                    $window.location.reload();
                                }
                            }).error(function (error) {
                            }).finally(function () {
                                $ionicLoading.hide();
                            })
                        }
                    },
                    {
                        text: '取消',
                        type: 'button-org botton-radius'
                    },
                ]
            });
        }

        function functionConstruction() {
            $scope.$emit('alertWarning', '功能正在建设中');
        }

        function logout() {
            $ionicPopup.show({
                title: '<div class="f f-ac f-c">是否确认退出？</div>',
                template: '',
                buttons: [
                    {
                        text: '确定',
                        type: 'button-balanced botton-radius',
                        onTap: function (e) {
                            var userType = $rootScope.userInfo.userType;
                            if ($sessionStorage.isLogged) {
                                $rootScope.isLogged = $sessionStorage.isLogged = false;
                                delete $sessionStorage.userInfo;
                                $rootScope.userInfo = {};
                                delete $sessionStorage.token;
                                $rootScope.token = null;
                            }
                            if (typeof WeixinJSBridge != "undefined") {
                                WeixinJSBridge.call('closeWindow')
                            } else {
                                if (userType == '0') { // welcome
                                    $ionicNativeTransitions.stateGo('login', {loginType: 'left'}, {}, {
                                        "type": "slide",
                                        "direction": "up"
                                    });
                                } else {
                                    $ionicNativeTransitions.stateGo('login', {loginType: 'right'}, {}, {
                                        "type": "slide",
                                        "direction": "up"
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
        }

        function getMasterList(type) {
            MstrService.getMasterList(type)
                .success(function (data) {
                    switch (type) {
                        case 'BANK_TYPE' :
                            vm.bankTypes = data.list;
                            break;
                    }
                }).error(function () {
            });
        }

        function typeChanged(type) {
            if (vm.bankTypeValue != type) {
                savebankUsed(type);

                vm.bankTypeValue = type;

                angular.forEach(vm.bankTypes, function (item) {
                    if (item.value == vm.bankTypeValue) {
                        vm.bankTypeText = item.text;
                        return;
                    }
                });
            }

            vm.flag = false;
        }

        function savebankUsed(bankTypeValue) {
            AccountService.saveBankUsed(
                vm.userId,
                bankTypeValue
            ).success(function (data) {
                $rootScope.userInfo.bankUsed = $sessionStorage.userInfo.bankUsed = data;
            }).error(function (error) {
            }).finally(function (error) {
            });
        }

        //可见/不可见
        function display() {
            if (vm.flag == false) {
                vm.flag = true;
            } else {
                vm.flag = false;
            }
        }

        ////刷新推广用户信息
        //vm.flag = true;
        //vm.times = true;
        //function refreshUser() {
        //
        //    if(vm.flag == false && vm.times == true){
        //        $scope.$emit('alertWarning', '您的操作太过频繁');
        //        timerOut();
        //        vm.times = false;
        //        return;
        //    }else if(vm.times == false){
        //        $scope.$emit('alertWarning', '您的操作太过频繁');
        //        return;
        //    }
        //    vm.flag = false;
        //    $ionicLoading.show();
        //    AccountService.refreshUser(
        //        vm.userId
        //    ).success(function (message) {
        //        if("1"==message.code){
        //            vm.model.grade="01"
        //        }
        //        $scope.$emit('alertWarning',message.message);
        //
        //        $ionicLoading.hide();
        //    }).error(function (error) {
        //    }).finally(function (error) {
        //        $ionicLoading.hide();
        //    });
        //}
        //function timerOut(){
        //    setTimeout(function(){
        //        vm.times = true;
        //        vm.flag = true;
        //    },5000)
        //}
    }
})();