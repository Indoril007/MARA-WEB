(function() {
	  
angular.
	module('logIn').
	component('logIn', {
		templateUrl: 'app/log-in/log-in.template.html',
		controller: ['$http', '$location', 'GoogleSignin', function ($http, $location, GoogleSignin) {
						var self = this;
							
							self.login = function () {
								console.log("login button pressed");
								GoogleSignin.signIn()
								.then(function (user) {
									// console.log(user);
									
									var uri = $location.protocol() + "://" + $location.host() + ":" + $location.port();
									console.log(uri)
									$http.post(uri + "/login", {
										id_token: user.Zi.id_token,
									}).then( function success(response) {
										console.log("success");
										$location.path('/dashboard');	
									});
								}, function (err) {
									console.log(err);
								});
							};
						}],
	});
}());