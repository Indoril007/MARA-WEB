(function(){
	
angular.module('logIn')	
	.config(['GoogleSigninProvider', function(GoogleSigninProvider) {
		GoogleSigninProvider.init({
			client_id: '97392255932-4sicu4r3e43i5u4bldib18h22h4a43mv',
		});
	}]);
	
}())