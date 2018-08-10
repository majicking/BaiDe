(function () {
    'use strict';

    angular.module('app').service('ProductService', ProductService);

    ProductService.$inject = ['$http', '$q'];

    function ProductService($http, $q) {
        return {
            rollLoadMore:function (currentPage,itemsPerPage,criteria) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/app/bill',{
                    params: {
                        currentPage: currentPage,
                        itemsPerPage:itemsPerPage,
                        criteria: criteria
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
            getAsset: function (userId) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/product/asset', {
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
            getRollInfo: function (userId, subAccountType) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/product/roll', {
                    params: {
                        userId: userId,
                        subAccountType: subAccountType
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
            exchangeInfo: function (userId, subAccountType) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/exchange/info', {
                    params: {
                        userId: userId,
                        subAccountType: subAccountType
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
            rollwelcomeParameter: function (rollwelcomeType) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/app/detail', {
                    params: {
                        tradeType: rollwelcomeType
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
            rollOut: function (input) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                // $http.post('http://www.baidecf.com/api/product/rollOut', input).success(function (message) {
                $http.post('http://www.baidecf.com/api/exchange/request', input).success(function (message) {
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
            rolIn: function (input) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('http://www.baidecf.com/api/product/rollIn', input).success(function (message) {
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
            getRollResult: function (id, subAccountType, pattern) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/product/roll/result', {
                    params: {
                        id: id,
                        subAccountType: subAccountType,
                        pattern: pattern
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
            getBillList: function (currentPage, itemsPerPage, criteria) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/product/bill', {
                    params: {
                        currentPage: currentPage,
                        itemsPerPage: itemsPerPage,
                        criteria: criteria
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

        };
    }
})();
