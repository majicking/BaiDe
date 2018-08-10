(function(){
    'use strict';

    angular.module('app').service('UploadService', UploadService);
    UploadService.$inject = ['$sessionStorage','FileUploader'];
    function UploadService($sessionStorage,FileUploader){

        var service = {
            init:init
        };

        return service;

        function init(queueLimit){
            var config = {
                url: 'http://www.baidecf.com/api/upload/temp',
                queueLimit:queueLimit
            }
            if ($sessionStorage.isLogged) {
                config.headers = {
                    Authorization: 'Bearer ' + $sessionStorage.userInfo.token
                }
            }
            var uploader = new FileUploader(config);
            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|jpeg|png|gif|'.indexOf(type) !== -1;
                }
            });
            return uploader;
        }
    }
})();