(function (angular) {
    function MainController($scope, $log, $anchorScroll, $location, winkasApi, $routeParams) {
        $scope.message = "WinKAS API Web Client";
        $scope.winkasServiceUrl = "http://localhost:51431/api/"; //"http://api.decom.dk/api/";
        $scope.appVersion = "0.22";

        $scope.userInfoDetailsVisible = false;
        $scope.tokenInfoDetailsVisible = false;

        $scope.methodid = 0;

        var auth = {
            code: "",
            user: "",
            pass: ""
        };

        $scope.apiMethodUrl = "";

        $scope.authInfo = auth;

        var onAuthComplete = function (response) {
            $scope.authMessage = '';

            if (response.WinKasStatus == 0) {
                $scope.token = response.WinKasData.CurrentToken;
                $scope.authMessage = response.WinKasMessage;
                $location.path("/");
            } else if (response.WinKasStatus == 1) {
                $scope.token = response.AuthenticationMessage;
                $scope.authMessage = response.WinKasMessage;
                $scope.tokenInfoDetailsVisible = true;
            } else {
                $scope.authMessage = 'Error';
            }

            $scope.rawAuthResponse = response;
            if ($scope.apiRequest == null) {
                $scope.apiRequest = JSON.stringify({ Token: $scope.token });
            }

        };

        var onAuthError = function (response) {
            $scope.token = "Unable to authenticate";
            $scope.authMessage = 'Error';
        };

        var onMethodHelpComplete = function(response) {
            console.log(response);
        };

        var onApiComplete = function (response) {
            //console.log(response);
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
            var r = winkasApi.winkasAuhenticate($scope.winkasServiceUrl + "authentication/authenticate", request);
            r.success(onAuthComplete);
            r.error(onAuthError);

            $scope.dismiss();
        };

        $scope.executeRequest = function () {

            var request = JSON.parse($scope.apiRequest);
            var r = winkasApi.winkasExecuteRequest($scope.winkasServiceUrl + $scope.apiMethodUrl, request);
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


        if ($location.search() != undefined && $location.search().methodid != undefined) {
            $scope.methodid = $location.search().methodid;

        }

        if ($scope.methodid > 0) {
            console.log('getting help for specific method: ' + $scope.methodid);
            var r = winkasApi.winkasGetMethodHelp($scope.winkasServiceUrl + "/examples/byid/" + $scope.methodid);
            r.success(onMethodHelpComplete);
            r.error(onApiError);
        }

    };

    var app = angular.module("winkasClient", ['ngRoute']);

    app.controller("MainController", ["$scope", "$log", "$anchorScroll", "$location", "winkasApi", "$routeParams", MainController]);

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

