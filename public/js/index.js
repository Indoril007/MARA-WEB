
(function() {

	var app = angular.module('mara-app', ['bp.img.cropper']);

	var augmentationsObject = null;
	
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
					handleAugm(file, filename);
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
		$scope.device = new Device();
		
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
			$.post('/uploader/target/' + $scope.filename, {
				base64: $scope.$croppable.croppedImage.$data.base64
			})
			.done( function(data) {
				console.log(data);
				
				augmentationsObject = new Target(data.targetName, data.collectionId, null, null, null)
				
				handleBackground('http://ec2-52-64-239-210.ap-southeast-2.compute.amazonaws.com:3000/file/' + $scope.filename);
			})
			.fail(function(data) {
			})
			.always(function(data) {
			});
		};
		
		$scope.uploadTarget = function() {
			$scope.hideDropzone();
			$scope.showAugmenter();
			$scope.post64();
			
		};
	}])

	

	
// var width = window.innerWidth * 0.58;
// var target_ratio;
// var augm_ratio;
// var stage;

// var augJSON = {};
// var zip = new JSZip();

// var blobLink = document.getElementById('blob');

var width = window.innerWidth *0.58;
var target_ratio;
var target_width;
var target_height;
var target_scale;
var augm_ratio = [];
var augm_width = [];
var augm_height;
var augm_scale = [];
var augm_url = [];
var augm_filename = [];
var stage;
var augm_counter = 0;
var grpX = [];
var grpY = [];
var augm_desc = [];
var tempid;
// variables for zipping files
var imgData;
// var zip = new JSZip();
var ctr = 0;

// var BackgroundLoader = document.getElementById('BackgroundLoader');
// BackgroundLoader.addEventListener('change', handleBackground, false);

// var AugmentImg = document.getElementById('AugmentImg');
// AugmentImg.addEventListener('change', handleAugm, false);

// if (JSZip.support.blob){
	// function downloadWithBlob(){
		// zip.generateAsync({type:"blob"}).then(function (blob) {
			// saveAs(blob, "download.zip");
			// // ADD JSON FILE EXTRACT HERE AS WELL //
		// }, function(err){
			// blobLink.innerHTML += " " + err;
		// });
		// return false;
	// }
	// $(document).on("click", "#blob", downloadWithBlob);  
// } else{
	// blobLink.innerHTML += " (not supported on this browser)";
// }

function handleBackground(imgUrl) {
		
		console.log("HANDLING BACKGROUND");
		
        var background = new Konva.Layer();
        var img = new Image();
        img.onload = function() {
            target_ratio = img.width / img.height;
            target_width = width;
            target_height = width / target_ratio;
			
			target_scale = target_width / img.width;
            console.log("The background scaled by " + target_scale);
            //if (img.width > img.height){
            stage = new Konva.Stage({
                container: 'augmenter',
                width: target_width,
                height: target_height
            });
            var TargetImg = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: target_width,
                height: target_height
            });
            // add the shape to the layer
            background.add(TargetImg);

            // add the layer to the stage
            stage.add(background);
        }

        img.src = imgUrl;

}

// function handleBackground(base64data) {
	// var augmenter = document.getElementById("augmenter");	
	// var background = new Konva.Layer();
	// var img = new Image();
	// img.onload = function() {
		// target_ratio = img.width / img.height;
		// //if (img.width > img.height){
		// stage = new Konva.Stage({
			// container: 'augmenter',
			// width: width,
			// height: width / target_ratio
		// });
		// var TargetImg = new Konva.Image({
			// x: 0,
			// y: 0,
			// image: img,
			// width: width,
			// height: width / target_ratio
		// });
		// // add the shape to the layer
		// background.add(TargetImg);

		// // add the layer to the stage
		// stage.add(background);
	// }
	// img.src = base64data;
// }
	
// function handleAugm(file, augID) {
    // var reader2 = new FileReader();
    // reader2.onload = function(event) {
        // var tempImg = new Image();
        // tempImg.onload = function() {
            // augm_ratio = tempImg.width / tempImg.height;

            // var layer1 = new Konva.Layer();
            // stage.add(layer1);

            // //1st augmentation image
            // var AugImg_1 =new Konva.Image({
                // width: tempImg.width,
                // height: tempImg.height
            // });

            // var Aug1Group = new Konva.Group({
                // x: 20,
                // y: 110,
                // draggable: true
            // });
            


            // // add the shape to the layer
            // layer1.add(Aug1Group);
            // Aug1Group.add(AugImg_1);
            // addAnchor(Aug1Group, 0, 0, 'topLeft');
            // addAnchor(Aug1Group, tempImg.width, 0, 'topRight');
            // addAnchor(Aug1Group, tempImg.width, tempImg.height, 'bottomRight');
            // addAnchor(Aug1Group, 0, tempImg.height, 'bottomLeft');
            // //test = Aug1Group.get('.topLeft')[0].getAttr('x');
            // //alert(test);

            // AugImg_1.image(tempImg);
            // layer1.draw();
        // }
        // //alert(event.target.result);
		// imgData = event.target.result;
		// tempImg.src = imgData;
		
		// imgData = imgData.split(',');
		
		
		// var re = new RegExp("data:image\/(.+);", "g");
		// var matches = re.exec(imgData[0]);
		// var filename = "aug"+ augID + "." + matches[1];
		// console.log(filename);
		
		// augJSON["aug" + augID] = {
									// name: "testname" + augID,
									// src: filename,
									// scale: 0.04,
									// xcoord: 0.2,
									// ycoord: 0.3,
									// description: "testDescription",
								// };
		
		// zip.folder("MARA-files").file(filename,imgData[1] ,{base64: true});
    // }
    // reader2.readAsDataURL(file);
	
// }


/********************************************************************************************************************/
function handleAugm(file, filename) {
    //  description.value=""; //when new aug added, clear description box
    var reader2 = new FileReader();
    reader2.onload = function(event) {
        var tempImg = new Image();
        tempImg.onload = function() {
            augm_ratio[augm_counter] = tempImg.width / tempImg.height;
            augm_height = target_height;                                            // Upload augmentation to size of target image (wikitude standard default unit)
            augm_width[augm_counter] = augm_height*augm_ratio[augm_counter];        // Calculate the width for each augmentation
            console.log("original width: "+ tempImg.width);
            console.log("scaled width: "+ augm_width[augm_counter]);
			
            var layer1 = new Konva.Layer();
            stage.add(layer1);

            //1st augmentation image
            var AugImg_1 = new Konva.Image({
                width: augm_width[augm_counter]/3,
                height: augm_height/3
            });

            var Aug1Group = new Konva.Group({
                x: 20,
                y: 100,
                id: augm_counter,
                draggable: true
            });



            // add the shape to the layer
            layer1.add(Aug1Group);
            Aug1Group.add(AugImg_1);
            addAnchor(Aug1Group, 0, 0, 'topLeft');
            addAnchor(Aug1Group, augm_width[augm_counter]/3, 0, 'topRight');
            addAnchor(Aug1Group, 0, augm_height/3, 'bottomLeft');
            addDragAnchor(Aug1Group, augm_width[augm_counter]/3, augm_height/3, 'bottomRight');
            //test = Aug1Group.get('.topLeft')[0].getAttr('x');
            //alert(test);

            AugImg_1.image(tempImg);
            test2 = Aug1Group.id();
			
            layer1.draw();
        }
		
        tempImg.src = event.target.result;
		
	    imgData = reader2.result;
		$.post('/uploader/augmentation/' + filename, {base64: imgData})
			.done(function(data){
				augm_url[augm_counter] = data.augmentationUrl;
			});
		
		
		augm_filename[augm_counter] = filename;
		augm_scale[augm_counter] = 1/3;
		augm_counter++;
		
        // //delay half second to make sure image finish loading
        // setTimeout(function() {
            // //Zipping part
            // if (ctr) {
                // imgData = reader2.result.split(',')[1];
                // zip.folder("MARA-files").file("aug" + ctr + ".png", imgData, {
                    // base64: true
                // });
            // } else {
                // //gets image data in base64
                // imgData = reader2.result.split(',')[1];
                // //adds into zip file
                // zip.folder("MARA-files").file("aug.png", imgData, {
                    // base64: true
                // });
            // }
            // augm_scale[augm_counter] = 1;
            // ctr++;
            // augm_counter++;
        // }, 500)


    }
    reader2.readAsDataURL(file);
}


function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var image = group.get('Image')[0];
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: false,
        dragOnTop: false
    });
    group.add(anchor);
}


function addDragAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var image = group.get('Image')[0];
    var groupID = group.id();
	var arrayIndex = groupID - 1;
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#3B7508',
        fill: '#93FF33',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
        console.log("dragmove");
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
        console.log("mousedown");
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
        console.log("dragend");
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

    group.on('mousedown touchstart', function() {
        if (!!augm_desc[groupID]){
            // description.value=augm_desc[groupID];
        }
        else{
        //display augmentation description text;
        // description.value="";
    }
        tempid = groupID;
            //when touch down, read scale, ratios
    });

    group.on('dragend', function() {
        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        grpX[groupID] = group.getX() + (topRight.getX() / 2);               //getting center of the group
        grpY[groupID] = group.getY() + (bottomRight.getY() / 2);
        grpX[groupID] = (grpX[groupID] / target_width)-0.5;                 // wikitude take center of image as origin, canvas take top left corner as origin
        grpX[groupID] = grpX[groupID]*target_width/target_height ;          // extra step: originally was scaled to the target width
                                                                            //             this convert the offset X to scale of SDU
        grpY[groupID] = ((grpY[groupID] / target_height)-0.5)*-1;           // wikitude take upwards as +ve, canvas take downwards as -ve

        console.log("Group Y is " + grpY[groupID]);
        console.log("Augmentation resize scale is " + augm_scale[groupID]);
		console.log("groupID is: " + groupID);
    });

    group.add(anchor);
}

//puts the text in description box into the variable
// function updateDesc(){
    // augm_desc[tempid]=description.value;
// }

function update(activeAnchor) {
    var group = activeAnchor.getParent();
    var groupID = group.id();
	var arrayIndex = groupID - 1;
	
	
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();


    var dragWidth = anchorX - bottomLeft.getX();
    var dragHeight = dragWidth / augm_ratio[groupID];
	
    // update anchor positions

    bottomLeft.setX(topLeft.getX());
    bottomLeft.setY(topLeft.getY() + dragHeight);
    topRight.setX(anchorX);
    topRight.setY(topLeft.getY());
    bottomRight.setY(topLeft.getY() + dragHeight);


    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }

    //calculate resize scale
    augm_scale[groupID] = dragHeight / augm_height;
}

function uploadAugmentations() {
	/************************** Extract data into json format ***************************************/

	// 1. after crop, send the background image to process the wtc file
	// 2. image in the wtc file should be named as backgroundimg?

	//initialize target image for json
	//backgroundimg = target image name in wtc file
	//var initTarget = new Device(backgroundimg); 
	var initAug; //variable to store augmentation json initiation

	//obtain x,y position and scale from augmentation images

	for (var i=0; i<augm_counter; i++){
		// var button = new Button("//NAME OF AUGOBJECT//", augm_url[i], grpX[i], grpY[i], augm_scale[i], augm_desc[i]);
		var button = new Button(augm_filename[i], augm_url[i+1], augm_scale[i+1], grpX[i+1], grpY[i+1],  "// Description placeholder //");
		console.log(button);
		augmentationsObject.addButtons([button]);
	}
	
	var jsonFilename = augmentationsObject.name + '.json'
	$.post('/uploader/json/' + jsonFilename, {json: JSON.stringify(augmentationsObject)})
			.done(function(data){
				console.log(data.jsonUrl);
			});
	
}

$( "#augButton" ).bind( "click", function(event, ui) {
	uploadAugmentations();
});

// var zipButton = document.getElementById('zipButton');

// if (JSZip.support.blob){
	
	// function downloadWithBlob(){
		// zip.generateAsync({type:"blob"}).then(function (blob) {
			// saveAs(blob, "download.zip");
			// // ADD JSON FILE EXTRACT HERE AS WELL //
		// }, function(err){
			// zipButton.innerHTML += " " + err;
		// });
		// return false;
	// }
	
	// $(document).on("click", "#zipButton", function() {
		// zip.folder("MARA-files").file("augmentations.json", JSON.stringify(augJSON));
		// downloadWithBlob();
	// });  
// } else{
	// zipButton.innerHTML += " (not supported on this browser)";
// }

// $(document).on("click", "#reset", function(){
	// stage.clear();
	// zip.remove("MARA-files");
	// ctr=0;
	// document.getElementById("blob").disabled = true;
// });

})();