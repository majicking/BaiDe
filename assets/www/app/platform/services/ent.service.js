(function () {
    'use strict';

    /* Services */
    angular.module('app').service('EntService', EntService);

    EntService.$inject = ['$http', '$q'];
    function EntService($http, $q) {
        return {
            getEntBank: function (userId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/ent/bank', {
                    params: {
                        userId: userId
                    }
                }).success(function (message) {
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
            },
            saveEnvBank: function (model) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('http://www.baidecf.com/api/ent/bank', model)
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
    }
})();