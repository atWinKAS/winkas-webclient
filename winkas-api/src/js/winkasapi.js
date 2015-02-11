(function () {

    var winkasApi = function($http) {

        function auhenticate(url, request) {
            return $http.post(url, request);
        };


        function executeRequest(url, request) {
            return $http.post(url, request);
        };

        function helpMethod(url) {
            return $http.get(url);
        };


        return {
            winkasAuhenticate: auhenticate,
            winkasExecuteRequest: executeRequest,
            winkasGetMethodHelp: helpMethod
        };

    };

    var module = angular.module("winkasClient");

    module.factory("winkasApi", winkasApi);

})();