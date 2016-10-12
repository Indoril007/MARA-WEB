(function(){
	
angular.module('logIn')	
	.config(['GoogleSigninProvider', function(GoogleSigninProvider) {
		GoogleSigninProvider.init({
			client_id: '286208149051-71lk7sdm5plc2oih79p7mq8g80kla8te',
		});
	}]);
	
}())