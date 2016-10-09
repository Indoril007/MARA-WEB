(function() {

angular.
  module('targetUpload').
  component('targetUpload', {
    templateUrl: 'app/target-upload/target-upload.template.html',
    controller: ['$scope', '$http', function($scope, $http) {
		this.uploadTarget = function() {
			// console.log($scope.$croppable.croppedImage.$data.base64);
			// console.log("filename: " + $scope.filename);
			
			$http.post('/uploader/target/' + $scope.filename, {
				base64: $scope.$croppable.croppedImage.$data.base64
			}).then(function success(response) {
				console.log("success")	
			}, function failuer(error) {
				console.log(error);
			});
			
		};
	}],
  });
  
}());