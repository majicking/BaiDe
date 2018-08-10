(function() {
    'use strict';

    angular.module('app').service('NoticeService', NoticeService);

    NoticeService.$inject = ['$http', '$q'];
    function NoticeService($http, $q){
        var service ={
            list:list,
            get:get
        }
        return service;

        function list (currentPage, itemsPerPage, criteria) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('http://www.baidecf.com/api/mobile/notice',
                {
                    params: {
                        currentPage: currentPage,
                        itemsPerPage: itemsPerPage,
                        criteria: criteria
                    }
                }
            ).success(function (message) {
                deferred.resolve(message.data);
            }).error(function (error) {
                deferred.reject(error);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }

        function get(id){
            var deferred = $q.defer();
            var promise = deferred.promise;
            $http.get('http://www.baidecf.com/api/mobile/notice/'+id)
                .success(function (message) {
                    deferred.resolve(message.data);
                }).error(function (error) {
                deferred.reject(error);
            });
            promise.success = function (fn) {
                promise.then(fn);
                return promise;
            };
            promise.error = function (fn) {
                promise.then(null, fn);
                return promise;
            };
            return promise;
        }
    }
})();
