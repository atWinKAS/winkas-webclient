(function(angular){
	function MainController($scope, $http){
		$scope.message = "WinKAS API Web Client";
		$scope.winkasServiceUrl = "http://localhost:51431/api/"; //"http://api.decom.dk/api/";
		
		var auth = {
			code: "admin",
			user: "at@winkas.dk",
			pass: "admin"
		};
		
		$scope.authInfo = auth;
		
		var onAuthComplete = function(response){
			console.log(response);
			$scope.authMessage = '';
			
			if (response.WinKasStatus == 0){
				console.log('WinKAS Authentication success.');
				$scope.token = response.WinKasData.CurrentToken;
				$scope.authMessage = response.WinKasMessage;
			} else if (response.WinKasStatus == 1){
				console.log('WinKAS Authentication error.');
				$scope.token = response.AuthenticationMessage;
				$scope.authMessage = response.WinKasMessage;
			} else {
				console.log('Undefined authentication status code.');
				$scope.authMessage = 'Error';
			}
			
			$scope.authRaw = response;
		};
		
		var onAuthError = function(response){
			console.log(response);
			$scope.token = "Unable to authenticate";
			$scope.authMessage = 'Error';
		};
		
				
		$scope.authenticate = function(){
		var request = {
			"UserContractCode": auth.code, 
			"UserName": auth.user, 
			"UserPassword": auth.pass, 
			"AuthLevel":"U"
		};
		var r = $http.post($scope.winkasServiceUrl + "authentication/authenticate", request);
		r.success(onAuthComplete);
		r.error(onAuthError);	
		};
		
	};	
	
	var app = angular.module("app", []);
	app.controller("MainController", ["$scope", "$http", MainController]);
	app.directive('niceJson', function(){
		return {
			restrict: 'E',
			templateUrl: 'nicejson.html'
		};
	});
	
})(angular);

