
(function() {

	var app = angular.module('mara-app', ['bp.img.cropper']);

	var dragAndDropper = function (scope, element, attrs) {
		element.bind('dragover', function(e){
			e.stopPropagation();
			e.preventDefault();
			scope.$apply(function () {
				scope.divClass = "drag-hover";
			});

		});
		
		element.bind('dragleave', function(e){
			e.stopPropagation();
			e.preventDefault();
			scope.$apply(function () {
				scope.divClass = "";
			});
		});
		
		element.bind('drop', function(e){
			e.stopPropagation();
			e.preventDefault();
			var file = e.originalEvent.dataTransfer.files[0];
			var filename = file.name;
			var fileURL = window.URL.createObjectURL(file);
			
			
			scope.$apply(function () {
				scope.divClass = "";
				scope.hideMessage();
				if (scope.dropzoneVisible) {
					scope.setTarget(fileURL, filename);
				} else if (scope.augmenterVisible) {
					var length = scope.augmentations.length;
					scope.addAugmentation(fileURL, filename)
					handleAugm(file, length);
					scope.zipButtonVisible = true;
				}
			});
		});
	}
	
	app.directive("dragAndDrop", ['$window', function($window) {
		return {
			restrict: 'A',
			link: dragAndDropper,
		};
	}]);
	
	app.controller("bodyController", ["$scope", function($scope) {
		$scope.messageVisible = true;
		$scope.dropzoneVisible = true;
		$scope.augmenterVisible = false;
		$scope.zipButtonVisible = false;
		
		$scope.augmentations = [];
		
		$scope.hideMessage = function() {
			$scope.messageVisible = false;
		};
		
		$scope.showMessage = function() {
			$scope.messageVisible = true;
		};
		
		$scope.dropzoneVisible = true;
		
		$scope.hideDropzone = function() {
			$scope.dropzoneVisible = false;
		};
		
		$scope.showDropzone = function() {
			$scope.dropzoneVisible = true;
		};
		
		$scope.hideAugmenter = function() {
			$scope.augmenterVisible = false;
		};
		
		$scope.showAugmenter = function() {
			$scope.augmenterVisible = true;
		};
		
		$scope.setTarget = function(targetURL, filename) {
			$scope.targetURL = targetURL;
			$scope.filename = filename;
		};
		
		$scope.addAugmentation = function(augmentationURL, filename) {
			$scope.augmentations.push({
				url: augmentationURL,
				name: filename,
			});
		};
		
		$scope.post64 = function() {
			$.post('/uploader/' + $scope.filename, {
					base64: $scope.$croppable.croppedImage.$data.base64
				}, function(result) {
					
			});
		};
		
		$scope.uploadTarget = function() {
			$scope.post64();
			$scope.hideDropzone();
			$scope.showAugmenter();
			handleBackground($scope.$croppable.croppedImage.$data.base64);
		};
	}])

var width = window.innerWidth * 0.58;
var target_ratio;
var augm_ratio;
var stage;

var augJSON = {};
var zip = new JSZip();

var blobLink = document.getElementById('blob');

if (JSZip.support.blob){
	function downloadWithBlob(){
		zip.generateAsync({type:"blob"}).then(function (blob) {
			saveAs(blob, "download.zip");
			// ADD JSON FILE EXTRACT HERE AS WELL //
		}, function(err){
			blobLink.innerHTML += " " + err;
		});
		return false;
	}
	$(document).on("click", "#blob", downloadWithBlob);  
} else{
	blobLink.innerHTML += " (not supported on this browser)";
}
	
function handleBackground(base64data) {
	var augmenter = document.getElementById("augmenter");	
	var background = new Konva.Layer();
	var img = new Image();
	img.onload = function() {
		target_ratio = img.width / img.height;
		//if (img.width > img.height){
		stage = new Konva.Stage({
			container: 'augmenter',
			width: width,
			height: width / target_ratio
		});
		var TargetImg = new Konva.Image({
			x: 0,
			y: 0,
			image: img,
			width: width,
			height: width / target_ratio
		});
		// add the shape to the layer
		background.add(TargetImg);

		// add the layer to the stage
		stage.add(background);
	}
	img.src = base64data;
}
	
function handleAugm(file, augID) {
    var reader2 = new FileReader();
    reader2.onload = function(event) {
        var tempImg = new Image();
        tempImg.onload = function() {
            augm_ratio = tempImg.width / tempImg.height;

            var layer1 = new Konva.Layer();
            stage.add(layer1);

            //1st augmentation image
            var AugImg_1 =new Konva.Image({
                width: tempImg.width,
                height: tempImg.height
            });

            var Aug1Group = new Konva.Group({
                x: 20,
                y: 110,
                draggable: true
            });
            


            // add the shape to the layer
            layer1.add(Aug1Group);
            Aug1Group.add(AugImg_1);
            addAnchor(Aug1Group, 0, 0, 'topLeft');
            addAnchor(Aug1Group, tempImg.width, 0, 'topRight');
            addAnchor(Aug1Group, tempImg.width, tempImg.height, 'bottomRight');
            addAnchor(Aug1Group, 0, tempImg.height, 'bottomLeft');
            //test = Aug1Group.get('.topLeft')[0].getAttr('x');
            //alert(test);

            AugImg_1.image(tempImg);
            layer1.draw();
        }
        //alert(event.target.result);
		imgData = event.target.result;
		tempImg.src = imgData;
		
		imgData = imgData.split(',');
		
		
		var re = new RegExp("data:image\/(.+);", "g");
		var matches = re.exec(imgData[0]);
		var filename = "aug"+ augID + "." + matches[1];
		console.log(filename);
		
		augJSON["aug" + augID] = {
									name: "testname" + augID,
									src: filename,
									scale: 0.04,
									xcoord: 0.2,
									ycoord: 0.3,
									description: "testDescription",
								};
		
		zip.folder("MARA-files").file(filename,imgData[1] ,{base64: true});
    }
    reader2.readAsDataURL(file);
	
}


function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    var dragWidth = topRight.getX() - topLeft.getX();
    var dragHeight = dragWidth / augm_ratio;

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            bottomLeft.setY(anchorY+dragHeight);
            bottomRight.setX(topRight.getX());
            bottomRight.setY(bottomLeft.getY());
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            bottomRight.setY(anchorY+dragHeight);
            bottomLeft.setX(topLeft.getX());
            bottomLeft.setY(bottomRight.getY());
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            topRight.setY(anchorY-dragHeight);
            topLeft.setX(bottomLeft.getX());
            topLeft.setY(topRight.getY());

            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            topLeft.setY(anchorY+dragHeight);
            topRight.setX(bottomRight.getX());
            topRight.setY(topLeft.getY());
            break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }
}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
}

var zipButton = document.getElementById('zipButton');

if (JSZip.support.blob){
	
	function downloadWithBlob(){
		zip.generateAsync({type:"blob"}).then(function (blob) {
			saveAs(blob, "download.zip");
			// ADD JSON FILE EXTRACT HERE AS WELL //
		}, function(err){
			zipButton.innerHTML += " " + err;
		});
		return false;
	}
	
	$(document).on("click", "#zipButton", function() {
		zip.folder("MARA-files").file("augmentations.json", JSON.stringify(augJSON));
		downloadWithBlob();
	});  
} else{
	zipButton.innerHTML += " (not supported on this browser)";
}

$(document).on("click", "#reset", function(){
	stage.clear();
	zip.remove("MARA-files");
	ctr=0;
	document.getElementById("blob").disabled = true;
});

})();