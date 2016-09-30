( function() {

angular.
  module('targetUpload').
  component('targetUpload', {
    template: 'target-upload.template.html',
    controller: ['$scope', dropzoneController],
  });
  
)

var dropzoneController = function ($scope) {

	

	this.messageVisible = true;
	this.dropzoneVisible = true;

	this.hideMessage = function() {
		this.messageVisible = false;
	};

	this.showMessage = function() {
		this.messageVisible = true;
	};

	this.hideDropzone = function() {
		this.dropzoneVisible = false;
	};

	this.showDropzone = function() {
		this.dropzoneVisible = true;
	};

	this.setTarget = function(targetURL, filename) {
		this.targetURL = targetURL;
		this.filename = filename;
	};

	this.post64 = function() {
		$.post('/uploader/' + this.filename, {
				base64: $scope.$croppable.croppedImage.$data.base64
			}, function(result) {
				
		});
	};

	this.uploadTarget = function() {
		this.post64();
		handleBackground($scope.$croppable.croppedImage.$data.base64);
	};
	  
	  
	  
}

}())