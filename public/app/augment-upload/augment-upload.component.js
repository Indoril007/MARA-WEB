(function() {

angular.
  module('augmentUpload').
  component('augmentUpload', {
    templateUrl: 'app/augment-upload/augment-upload.template.html',
    controller: ['$scope', '$location', '$window', '$http', '$routeParams', function($scope, $location, $window, $http, $routeParams) {
		var self = this;

		self.collectionId = $routeParams.collectionid;
		self.targetId = $routeParams.targetid;
		self.target = null;
		self.background = null;
		self.augmentations = [];
		self.augm_count = 0;

		var width = document.getElementById('dropzone').clientWidth;

		$http.get('targetCollections/' + self.collectionId + '/targets/' + self.targetId)
			.then(response => {
				self.target = response.data;
			})
			.then(() => {
				var backgroundUrl = $location.protocol() + "://" + $location.host() + ":" + $location.port() + self.target.imgUrl; 	
				return konvaHelpers.initKonvaBackground(backgroundUrl, width, 'dropzone');

			})
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