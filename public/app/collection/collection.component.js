(function() {

angular.
  module('collection').
  component('collection', {
    templateUrl: 'app/collection/collection.template.html',
    controller: ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
		var self = this;
		self.id = $routeParams.id;

		$http.get('/targetCollections/' + self.id).
			then(function success(response) {
				self.targetCollection = response.data;
			});

		self.addNewTarget = function() {
			console.log('/collections/' + self.id + '/targetupload')
			$location.path('/targetupload/' + self.id)
		};

		self.addAugmentations = function(targetId) {
			
		};
		
	}],
  });
  
}());