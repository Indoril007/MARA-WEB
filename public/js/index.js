
(function() {

	var app = angular.module('mara-app', ['bp.img.cropper']);

	app.directive("dragAndDrop", ['$window', function($window) {
		
		return {
			
			restrict: 'A',
			
			link: function($scope, element, attrs) {
				
				element.bind('dragover', function(e){
					e.stopPropagation();
					e.preventDefault();
					$scope.$apply(function () {
						$scope.divClass = "drag-hover";
					});

				});
				
				element.bind('dragleave', function(e){
					e.stopPropagation();
					e.preventDefault();
					$scope.$apply(function () {
						$scope.divClass = "";
					});
				});
				
				element.bind('drop', function(e){
					e.stopPropagation();
					e.preventDefault();
					var file = e.originalEvent.dataTransfer.files[0];
					var imgurl = $window.URL.createObjectURL(file);
					$scope.$apply(function () {
						$scope.divClass = "";
						$scope.imgsrc = imgurl;
					});
				});
				
			},
		};
		
	}]);

})();