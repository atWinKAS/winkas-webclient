// Code goes here

(function() {
  var winKAS = function() {

    var token;
	
	var winkasServerUrl = 'http://api.decom.dk/api/';

    var winkasAuthenticate = function(code, user, pass) {
      console.log('authenticating with: code = ' + code + ', user name = ' + user + ', password = ' + pass);
      
      xmlhttp = new XMLHttpRequest();
      xmlhttp.open("POST", winkasServerUrl + "authentication/authenticate", false);
      xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      xmlhttp.send('UserName=' + user + '&UserPassword=' + pass + '&UserContractCode=' + code);
      console.log(xmlhttp.responseText);
      
    };

    var winkasApiMethod = function() {
      console.log('executing...');
    };

    return {
      authenticate: winkasAuthenticate,
      executeAction: winkasApiMethod
    };

  };

  var api = winKAS();

  api.authenticate('admin', 'at@winkas.dk', 'admin');
  api.executeAction();
  api.executeAction();
}());