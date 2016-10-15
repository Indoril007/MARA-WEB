(function() {

angular.
  module('augmentUpload').
  component('augmentUpload', {
    templateUrl: 'app/augment-upload/augment-upload.template.html',
    controller: ['$scope', '$location', '$window', '$http', function($scope, $location, $window, $http) {
		var self = this;

		var backgroundUrl = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/file/AssignmentPic.jpg"; 
		var width = $window.innerWidth *0.58;
		self.background = null;
		self.augmentations = [];
		self.augm_count = 0;
		konvaHelpers.initKonvaBackground(backgroundUrl, width, 'dropzone')
			.then(background => {
				self.background = background;
			});

		$scope.$on('fileUploaded', function(event, file) {
					var augm = new konvaHelpers.Augmentation(self.augm_count);
					augm.initSrc(file)
						.then(() => {
							return augm.initImg();
						})
						.then(() => {
							konvaHelpers.addAugmToKonva(self.background, augm);
							self.augmentations.push(augm);
							self.augm_count++;
						});
				});
	}],
  });
  
}());