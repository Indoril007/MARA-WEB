(function() {

angular.module('cropper')
	.directive('cropper', function() {
		return {
			templateUrl: 'app/cropper/cropper.template.html',
			restrict: 'E',
			controller: ['$scope', function cropperController($scope) {
				
				$scope.$on('fileUploaded', function(event, file) {
					console.log(file);
					$scope.imgUrl = window.URL.createObjectURL(file);
				});
				
			}],
		};
	});
 
}());