(function() {

angular.
  module('dashboard').
  component('dashboard', {
    templateUrl: 'app/dashboard/dashboard.template.html',
    controller: ['$scope', '$http', function($scope, $http) {
		var self = this;

		$http.get('/targetCollections').
			then(function success(response) {
				self.targetCollections = response.data;
			});

	}],
  });
  
}());