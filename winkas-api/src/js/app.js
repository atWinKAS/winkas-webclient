(function (angular) {
    function MainController($scope, $http, $log, $anchorScroll, $location) {
        $scope.message = "WinKAS API Web Client";
        $scope.winkasServiceUrl = "http://api.decom.dk/api/";
        $scope.appVersion = "0.22";

        $scope.userInfoDetailsVisible = false;
        $scope.tokenInfoDetailsVisible = false;

        var auth = {
            code: "",
            user: "",
            pass: ""
        };

        $scope.apiMethodUrl = "";

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
                $scope.tokenInfoDetailsVisible = true;
            } else {
                $scope.authMessage = 'Error';
            }

            $scope.rawAuthResponse = response;
            $scope.apiRequest = JSON.stringify({ Token: $scope.token });
           
        };

        var onAuthError = function (response) {
            $scope.token = "Unable to authenticate";
            $scope.authMessage = 'Error';
        };

        var onApiComplete = function (response) {
            console.log(response);
            $scope.rawApiResponse = response;

            //$location.hash("winkasRequestRow");
            //$anchorScroll();
        };

        var onApiError = function (response) {
            console.log(response);
            $scope.rawApiResponse = response;
        };


        $scope.authenticate = function () {
            $log.info("Going to authenticate user...");
            var request = {
                "UserContractCode": auth.code,
                "UserName": auth.user,
                "UserPassword": auth.pass,
                "AuthLevel": "U"
            };
            var r = $http.post($scope.winkasServiceUrl + "authentication/authenticate", request);
            r.success(onAuthComplete);
            r.error(onAuthError);

            $scope.dismiss();
        };

        $scope.executeRequest = function () {

            var request = JSON.parse($scope.apiRequest);
            var r = $http.post($scope.winkasServiceUrl + $scope.apiMethodUrl, request);
            r.success(onApiComplete);
            r.error(onApiError);

            $scope.rawApiRequest = request;

        };

        $scope.showHideUserInfo = function() {
            $scope.userInfoDetailsVisible = !$scope.userInfoDetailsVisible;
        };

        $scope.showHideTokenInfo = function () {
            $scope.tokenInfoDetailsVisible = !$scope.tokenInfoDetailsVisible;
        };

    };

    var app = angular.module("app", []);
    app.controller("MainController", ["$scope", "$http", "$log", "$anchorScroll", "$location", MainController]);

    app.directive('rawJson', function () {
        return {
            link: function ($scope, element, attrs) {
                $scope.$watch(attrs.rawJson, function (value) {
                    document.getElementById(attrs.id).innerHTML = '';
                    if (value !== undefined) {

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

    app.directive('closeModal', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.dismiss = function () {
                    element.modal('hide');
                };
            }
        }
    });

})(angular);

