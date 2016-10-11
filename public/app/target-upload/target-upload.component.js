(function() {

angular.
  module('targetUpload').
  component('targetUpload', {
    templateUrl: 'app/target-upload/target-upload.template.html',
    controller: ['$scope', '$http', function($scope, $http) {
		
		// allocating this to self for use in callback functions
		var self = this;
		self.targetName = "Target Name";
		
		// This event is triggered by the drag-and-drop directive when a file is dropped
		$scope.$on('fileUploaded', function(event, file) {
			
					// Getting the base64 of the uncropped image for the case when no cropping is done
					var reader = new FileReader();
					
					reader.onloadend = function() {
						self.imgBase64 = reader.result;
					};
					
					reader.readAsDataURL(file);
			
					// This URL is used by the cropper as an ng-src
					self.imgUrl = window.URL.createObjectURL(file);
					
				});
		
		// Triggered by the upload target button
		self.uploadTarget = function() {
			
			// Checking if image has been cropped and if so take the base 64 of the cropped selection only
			if ($scope.$croppable.croppedImage.$hasSelection) {
				self.imgBase64 = $scope.$croppable.croppedImage.$data.base64;
			}
			
			
			$http.post('/uploader/target/' + $scope.filename, {
				base64: self.imgBase64
			}).then(function success(response) {
				console.log("success")	
			}, function failuer(error) {
				console.log(error);
			});
		};
		
	}],
  });
  
}());