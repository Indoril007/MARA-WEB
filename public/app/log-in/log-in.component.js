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
									
									var uri = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/login";
									console.log(uri)
									$http.post(uri, {
										// id_token: user.Zi.id_token,
										test: 'test',
									});
								}, function (err) {
									console.log(err);
								});
							};
						}],
	});
}());