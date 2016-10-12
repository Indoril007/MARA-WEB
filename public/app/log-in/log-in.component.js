(function() {
	  
angular.
	module('logIn').
	component('logIn', {
		templateUrl: 'app/log-in/log-in.template.html',
		controller: ['$http', 'GoogleSignin', function (GoogleSignin) {
						var self = this;
							
							self.login = function () {
								console.log("login button pressed");
								GoogleSignin.signIn()
								.then(function (user) {
									// console.log(user);
									$http.post('/login', {
										user_id_token: user.Zi.id_token,
									})
									
								}, function (err) {
									console.log(err);
								});
							};
						}],
	});
}());