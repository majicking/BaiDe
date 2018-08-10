
(function () {
    'use strict';

    angular.module('app').service('MarketService', MarketService);

    MarketService.$inject = ['$http', '$q'];
    function MarketService($http, $q) {
        return {
            getCurrentMarket: function () {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/market/current_market', {
                    params: {
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
            getTrendDatas: function (flag) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/market/getTrends', {
                    params: {
                        trendFlag:flag
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
            }

        }
    }
})();