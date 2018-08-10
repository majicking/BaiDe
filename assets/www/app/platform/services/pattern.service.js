/**
 * Created by wyym on 2018/3/21.
 */
(function () {
    'use strict';

    angular.module('app').service('PatternService', PatternService);

    PatternService.$inject = ['$http', '$q'];
    function PatternService($http, $q) {
        return {
            // getOtcSellList: function (currentPage, itemsPerPage, criteria) {
            //     var deferred = $q.defer();
            //     var promise = deferred.promise;
            //     $http.get('http://www.baidecf.com/api/otc/market_page', {
            //         params: {
            //             currentPage: currentPage,
            //             itemsPerPage: itemsPerPage,
            //             criteria: criteria
            //         }
            //     }).success(function (message) {
            //         deferred.resolve(message.data);
            //     }).error(function (error) {
            //         deferred.reject(error);
            //     });
            //     promise.success = function (fn) {
            //         promise.then(fn);
            //         return promise;
            //     };
            //     promise.error = function (fn) {
            //         promise.then(null, fn);
            //         return promise;
            //     };
            //     return promise;
            // },
            // getOtcBuyList: function (currentPage, itemsPerPage, criteria) {
            //     var deferred = $q.defer();
            //     var promise = deferred.promise;
            //     $http.get('http://www.baidecf.com/api/otc/my_buy_list', {
            //         params: {
            //             currentPage: currentPage,
            //             itemsPerPage: itemsPerPage,
            //             criteria: criteria
            //         }
            //     }).success(function (message) {
            //         deferred.resolve(message.data);
            //     }).error(function (error) {
            //         deferred.reject(error);
            //     });
            //     promise.success = function (fn) {
            //         promise.then(fn);
            //         return promise;
            //     };
            //     promise.error = function (fn) {
            //         promise.then(null, fn);
            //         return promise;
            //     };
            //     return promise;
            // },
            patternAdd: function (model) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('http://www.baidecf.com/api/user/pattern_save', model).success(function (message) {
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
            patternUpdateUsed: function (model) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('http://www.baidecf.com/api/user/pattern_update_used', model).success(function (message) {
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
            getPatternByUser: function (userid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/user/getPatternByUser', {
                    params: {
                        currentUser: userid
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
            getPatternByUUID: function (uuid) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/user/getPatternByUUID', {
                    params: {
                        uuid: uuid
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
            checkPattern: function (model) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.post('http://www.baidecf.com/api/user/checkPattern', model).success(function (message) {
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