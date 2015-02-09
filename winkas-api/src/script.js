(function (angular) {
    function MainController($scope, $http) {
        $scope.message = "WinKAS API Web Client";
        $scope.winkasServiceUrl = "http://localhost:51431/api/"; //"http://api.decom.dk/api/";

        var auth = {
            code: "admin",
            user: "at@winkas.dk",
            pass: "admin"
        };

        $scope.apiMethodUrl = "accounts/all";

        $scope.authInfo = auth;

        var onAuthComplete = function (response) {
            console.log(response);
            $scope.authMessage = '';

            if (response.WinKasStatus == 0) {
                $scope.token = response.WinKasData.CurrentToken;
                $scope.authMessage = response.WinKasMessage;
            } else if (response.WinKasStatus == 1) {
                $scope.token = response.AuthenticationMessage;
                $scope.authMessage = response.WinKasMessage;
            } else {
                $scope.authMessage = 'Error';
            }

            $scope.rawAuthResponse = response;
            $scope.apiRequest = JSON.stringify({Token: $scope.token});
        };

        var onAuthError = function (response) {
            $scope.token = "Unable to authenticate";
            $scope.authMessage = 'Error';
        };

        var onApiComplete = function (response) {
            console.log(response);
            $scope.rawApiResponse = response;
        };

        var onApiError = function (response) {
            console.log(response);
            $scope.rawApiResponse = response;
        };


        $scope.authenticate = function () {
            var request = {
                "UserContractCode": auth.code,
                "UserName": auth.user,
                "UserPassword": auth.pass,
                "AuthLevel": "U"
            };
            var r = $http.post($scope.winkasServiceUrl + "authentication/authenticate", request);
            r.success(onAuthComplete);
            r.error(onAuthError);
        };

        $scope.executeRequest = function () {

            var request = JSON.parse($scope.apiRequest);
            var r = $http.post($scope.winkasServiceUrl + $scope.apiMethodUrl, request);
            r.success(onApiComplete);
            r.error(onApiError);

            $scope.rawApiRequest = request;

        };

    };

    var app = angular.module("app", []);
    app.controller("MainController", ["$scope", "$http", MainController]);

    app.directive('rawJson', function () {
        return {
            link: function ($scope, element, attrs) {

                $scope.$watch(attrs.rawJson, function (value) {
                    document.getElementById(attrs.id).innerHTML = '';
                    if (value !== undefined) {

                        console.log(attrs.expanded);
                        var showLevel = "0";
                        if (attrs.expanded === "true") {
                            showLevel = "all";
                        }

                        document.getElementById(attrs.id).appendChild(renderjson.set_icons('+', '-').set_show_to_level(showLevel)(value));
                    }
                });
            }
        }
    });

})(angular);

