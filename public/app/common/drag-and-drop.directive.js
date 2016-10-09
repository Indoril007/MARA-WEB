(function() {

function dragAndDropper(scope, element, attrs, ctrl) {
	
	element.css( {	
					border: '2px dashed #0087F7',
					'border-radius': '5px',
				} );
	
	element.bind('dragover', function(event){
		event.stopPropagation();
		event.preventDefault();
		element.css("border-style", "solid");
	});
	
	element.bind('dragleave', function(event){
		event.stopPropagation();
		event.preventDefault();
		element.css("border-style", "dashed");
	});
	
	element.bind('drop', function(e){
		event.stopPropagation();
		event.preventDefault();
		element.css("border-style", "dashed");
		
		var droppedFile = e.originalEvent.dataTransfer.files[0];
		ctrl.dropFile(droppedFile);
	});
}

angular.module('dragAndDrop')
	.directive('dragAndDrop', function() {
		return {
			restrict: 'A',
			link: dragAndDropper,
			controller: ['$scope', function dragAndDropController($scope) {
				
				$scope.dragMessageOn = true;
				
				this.dropFile = function(file) {
					$scope.dragMessageOn = false;
					$scope.droppedFile = file;
					$scope.filename = file.name;
					$scope.$broadcast('fileUploaded', file); 
					$scope.$digest();
					// console.log(file.name);
				}
			}],
		};
	});
 
}());