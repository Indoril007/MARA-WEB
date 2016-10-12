(function(){
	
angular.module('logIn')	
	.config(['GoogleSigninProvider', function(GoogleSigninProvider) {
		GoogleSigninProvider.init({
			client_id: 'YOUR_CLIENT_ID',
		});
	}]);
	
}())