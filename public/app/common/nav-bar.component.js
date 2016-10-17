(function() {

angular.
  module('navBar').
  component('navBar', {
    templateUrl: 'app/common/nav-bar.template.html',
    controller: ['$scope', '$location', '$http', 'GoogleSignin', function($scope, $location, $http, GoogleSignin) {
    	var self = this;

    	self.currentLocation = $location.path();
    	showSignIn(self.currentLocation)
    	

    	$scope.$on('$locationChangeSuccess', function(event) {
    		self.currentLocation = $location.path();
    		showSignIn(self.currentLocation);
    	});

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
		}

    	function showSignIn(path) {
	    	if (path === '/login') {
	    		self.showSignIn = true;
	    		self.showLogOut = false;
	    	} else {
	    		self.showSignIn = false;
	    		self.showLogOut = true;
	    	}
    	}
    }],
  });
  
}());