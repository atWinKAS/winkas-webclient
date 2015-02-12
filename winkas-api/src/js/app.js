(function (angular) {
    function MainController($scope, $log, $anchorScroll, $location, winkasApi, $routeParams, toaster) {
        $scope.message = "WinKAS API Web Client";
        $scope.winkasServiceUrl = "http://api.decom.dk/api/";
        $scope.appVersion = "0.25";

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
                toaster.pop('success', "authentication", "User has been successfully authenticated");
            } else if (response.WinKasStatus == 1) {
                $scope.token = response.AuthenticationMessage;
                $scope.authMessage = response.WinKasMessage;
                $scope.tokenInfoDetailsVisible = true;
                toaster.pop('error', "authentication", response.AuthenticationMessage);
            } else {
                $scope.authMessage = 'Error';
                toaster.pop('error', "authentication", "Unable to authenticate user");
            }

            $scope.rawAuthResponse = response;

            if ($scope.apiRequest == null) {
                $scope.apiRequest = JSON.stringify({ Token: $scope.token });
            } else {
                var currentRequest = JSON.parse($scope.apiRequest);
                currentRequest.Token = $scope.token;
                $scope.apiRequest = JSON.stringify(currentRequest);
            }

        };

        var onAuthError = function (response) {
            $scope.token = "Unable to authenticate";
            $scope.authMessage = 'Error';
            toaster.pop('error', "authentication", "Unable to authenticate user");
        };

        var onMethodHelpComplete = function(response) {
            if (response.Example !== undefined) {
                var m = response.Example.Controller + "/" + response.Example.Method;
                $scope.apiMethodUrl = m;
            
                $scope.apiRequest = response.Example.InExample;
                toaster.pop('success', "api help", "Here is " + m + " example");
            } else {
                toaster.pop('error', "api help", "Unable to get method description");
            }
        };

        var onHelpApiError = function (response) {
            toaster.pop('error', "api help", "Unable to get method description");
        };

        var onApiComplete = function (response) {
            $scope.rawApiResponse = response;

            var msg = "WinKAS API method has been executed";
            if (response !== undefined && response.WinKasMessage !== undefined) {
                msg = response.WinKasMessage;
            }
            toaster.pop('success', "api method", msg);
        };

        var onApiError = function (response) {
            $scope.rawApiResponse = response;
            var msg = "WinKAS API Error";
            if (response !== undefined && response.WinKasMessage !== undefined) {
                msg = response.WinKasMessage;
            }
            toaster.pop('error', "api method", msg);
        };

        $scope.authenticate = function () {

            toaster.pop('wait', "authentication", "WinKAS is authenticating you...");

            $log.info("Going to authenticate user...");
            var authRequest = {
                "UserContractCode": auth.code,
                "UserName": auth.user,
                "UserPassword": auth.pass,
                "AuthLevel": "U"
            };
            var authRequestExecutor = winkasApi.winkasAuhenticate($scope.winkasServiceUrl + "authentication/authenticate", authRequest);
            authRequestExecutor.success(onAuthComplete);
            authRequestExecutor.error(onAuthError);

            $scope.dismiss();
        };

        $scope.executeRequest = function () {

            toaster.pop('wait', "api method", "Executing WinKAS API menthod...");

            var anyRequest = JSON.parse($scope.apiRequest);
            var anyRequestExecutor = winkasApi.winkasExecuteRequest($scope.winkasServiceUrl + $scope.apiMethodUrl, anyRequest);
            anyRequestExecutor.success(onApiComplete);
            anyRequestExecutor.error(onApiError);

            $scope.rawApiRequest = anyRequest;

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
            toaster.pop('wait', "api help", "Trying to get help for method...");
            var helpRequestExecutor = winkasApi.winkasGetMethodHelp($scope.winkasServiceUrl + "/examples/byid/" + $scope.methodid);
            helpRequestExecutor.success(onMethodHelpComplete);
            helpRequestExecutor.error(onHelpApiError);
        }

    };

    var app = angular.module("winkasClient", ['ngRoute', 'toaster']);

    app.controller("MainController", ["$scope", "$log", "$anchorScroll", "$location", "winkasApi", "$routeParams", "toaster", MainController]);

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

