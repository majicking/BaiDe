/**
 * Created by lifeng on 2016/1/21.
 */
(function () {
    'use strict';

    angular.module('app').service('MstrService', MstrService);

    MstrService.$inject = ['$http', '$q'];
    function MstrService($http, $q) {
        return {
            getMasterList: function (type){
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/mstr',
                    {
                        params: {
                            type: type
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
            },
            getGradeList: function (userType){
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/mstr/grade',
                    {
                        params: {
                            userType: userType
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
            },
            getBizList: function (tradeTypeList, manual){
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/mstr/biz',
                    {
                        params: {
                            tradeTypeList: tradeTypeList,
                            manual: manual
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
            },
            getAreaChildrenList: function (areaParentId){
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/mstr/area',
                    {
                        params: {
                            areaParentId: areaParentId
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
            },
            getTradeTypeList: function (tradeTypeList, biz, manual){
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get('http://www.baidecf.com/api/mstr/trade',
                    {
                        params: {
                            tradeTypeList: tradeTypeList,
                            biz: biz,
                            manual: manual
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
        }
    }
})();