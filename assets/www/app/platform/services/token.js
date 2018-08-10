/**
 * Created by lifeng on 2016/1/13.
 */
(function () {
    'use strict';

    /* Services */
    angular.module('app').factory('TokenInterceptor', TokenInterceptor);

    TokenInterceptor.$inject = ['$q', '$sessionStorage'];
    function TokenInterceptor($q, $sessionStorage) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($sessionStorage.isLogged) {
                    config.headers.Authorization = 'Bearer ' + $sessionStorage.userInfo.token;
                }
                return config;
            },

            response: function (response) {
                return response || $q.when(response);
            }
        };
    }
})();