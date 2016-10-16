(function() {

angular.
  module('dashboard').
  component('dashboard', {
    templateUrl: 'app/dashboard/dashboard.template.html',
    controller: ['$scope', '$http', '$location', function($scope, $http, $location) {
		var self = this;

		self.newCollectionName = "";

		$http.get('/targetCollections').
			then(function success(response) {
				self.targetCollections = response.data;
			});

		self.addCollection = function() {

			$http.post('/targetCollections', {name: self.newCollectionName})
				.then(function success(response) {
					self.targetCollections = response.data;	
				}, function rejected(response) {

				});

		};

		self.deleteCollection = function(id) {
			$http.delete('/targetCollections/' + id)
				.then(function success(response) {
					self.targetCollections = response.data;	
				}, function rejected(response) {

				});
		};

		self.navToCollection = function(id) {
			$location.path('/collections/' + id);
		};

	}],
  });
  
}());