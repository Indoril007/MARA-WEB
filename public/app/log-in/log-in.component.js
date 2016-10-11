(function() {
	  
angular.
  module('logIn').
  component('logIn', {
    templateUrl: 'app/log-in/log-in.template.html',
    controller: function(){
		
		var self = this;
		
		self.onSignIn = function(googleUser) {
			  var profile = googleUser.getBasicProfile();
			  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
			  console.log('Name: ' + profile.getName());
			  console.log('Image URL: ' + profile.getImageUrl());
			  console.log('Email: ' + profile.getEmail());
			}
			
	},
  });
  
}());