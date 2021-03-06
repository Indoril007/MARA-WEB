(function() {

angular.
  module('targetUpload').
  component('targetUpload', {
    templateUrl: 'app/target-upload/target-upload.template.html',
    controller: ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
		
		// allocating this to self for use in callback functions
		var self = this;
		self.newTargetName = "";
		
		$http.get('/targetCollections').
			then(function success(response) {
				self.targetCollections = response.data;
			});
		
		// This event is triggered by the drag-and-drop directive when a file is dropped
		$scope.$on('fileUploaded', function(event, file) {
					self.filename = file.name;

					// Getting the base64 of the uncropped image for the case when no cropping is done
					var reader = new FileReader();
					
					reader.onloadend = function() {
						self.imgBase64 = reader.result;
					};
					
					reader.readAsDataURL(file);
			
					// This URL is used by the cropper as an ng-src
					self.imgUrl = window.URL.createObjectURL(file);

					var re = /(.+)\.(.+?)$/;
					var matches = re.exec(self.filename);
					self.extension = matches[2];
				});
		
		// Triggered by the upload target button
		self.uploadTarget = function() {
			
			if(self.newTargetName === "") {
				return;
			}

			// Checking if image has been cropped and if so take the base 64 of the cropped selection only
			if ($scope.$croppable.croppedImage.$hasSelection) {
				self.imgBase64 = $scope.$croppable.croppedImage.$data.base64;
			}
			
			
			$http.post('/targetCollections/' + $routeParams.id + '/targetupload/', {
				base64: self.imgBase64,
				name: self.newTargetName,
				filename: self.filename,
				extension: self.extension,
			}).then(function success(response) {
				console.log("success")	
				$location.path('collections/' + $routeParams.id)
			}, function failuer(error) {
				console.log(error);
			});
		};
		
	}],
  });
  
}());