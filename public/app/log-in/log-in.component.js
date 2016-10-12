(function() {
	  
angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'app/log-in/log-in.template.html',
    controller: ['GoogleSignin', function (GoogleSignin) {
					var self = this;
		
						self.login = function () {
							GoogleSignin.signIn().then(function (user) {
								console.log(user);
								
							}, function (err) {
								console.log(err);
							});
						};
					}];
  
}());