(function(){
	var app = angular.module('app', ['bp.img.cropper']);
	
	app.controller('cropController', ['$scope', function($scope) {
		
		var selectedIndex = null;
		
		$scope.images = [];
		
		$scope.addImage = function(src, name) {
			$scope.images.push({
				"src": src,
				"name": name, 
				active: true,
			})
			console.log("image added");
		};
		
		$scope.selectImage = function(index) {
			selectedIndex = index;
			$scope.selected = $scope.images[index];
			console.log("image selected " + index)
		};
		
		$scope.postBase64 = function() {
			
			handleBackgroundImg($scope.$croppable.croppedImage.$data.base64);
			
			$.post('/uploader/' + $scope.selected.name, {
				base64: $scope.$croppable.croppedImage.$data.base64
			}, function(result) {
				
			});
			
			console.log($scope.$croppable.croppedImage.$data.base64);
		}
		
		// $scope.selected = {
			// src: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
			// active: true,
		// };
		
	}]);

	Dropzone.options.myDropzone = {
		autoProcessQueue: false,
		init: function() {
			
			var myDropzone = this;
			var submitButton = document.querySelector("#start-upload");
			
			submitButton.style.visibility = "hidden";
			
			myDropzone.filenumber = 0;
			
			submitButton.addEventListener("click", function() {
				myDropzone.processQueue();
			});
			
			myDropzone.on("addedfile", function(file) {
				let index = myDropzone.filenumber;
				
				submitButton.style.visibility = "visible";
				console.log(file);
				
				var imgurl =  window.URL.createObjectURL(file);
				file.previewElement.imgurl = imgurl;
				
				angular.element(document.getElementById('cropController')).scope().addImage(imgurl, file.name);

				file.previewElement.onclick = function () {
					angular.element(document.getElementById('cropController')).scope().selectImage(index);
					angular.element(document.getElementById('cropController')).scope().$apply();
				}
				
				myDropzone.filenumber += 1;
				
			})
		},
	};
	
	
	function handleBackgroundImg(src){
			var width = window.innerWidth/2;
			var height = window.innerHeight/2;
		  var background = new Konva.Layer();
		  var img = new Image();
		  img.onload = function(){
			var ratio = img.width/img.height;
			  var stage = new Konva.Stage({
				container: 'container',
				width: width,
				height: width/ratio
			  });
			  var TargetImg = new Konva.Image({
				x: 0,
				y: 0,
				image: img,
				width: width,
				height: width/ratio
			  });
					 // add the shape to the layer
		  background.add(TargetImg);

		  // add the layer to the stage
		  stage.add(background);
		  }

		img.src = src; 
	}
	
	// $("#augmentation-add").click( function() {
		
	// })

	// var canvas = document.getElementById('imageCanvas');
				// var ctx = canvas.getContext('2d');
				// var img = new Image();
				// img.src = window.URL.createObjectURL(file);
				
				// img.onload = function(){
				  // var ratio = img.width/img.height;
				  // if (img.width > img.height){
					// ctx.canvas.width = window.innerWidth/2;
					// ctx.canvas.height = ctx.canvas.width/ratio;
				  // } else{
					// ctx.canvas.height = window.innerHeight/2;
					// ctx.canvas.width = ctx.canvas.height*ratio;
				  // }
				  // ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
				  // console.log("here")
				// }
})();		
