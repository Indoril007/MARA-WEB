

var angular = require('angular');
var app = angular.module('app', []);

Dropzone.options.myDropzone = {
	autoProcessQueue: false,
	init: function() {
		
		var submitButton = document.querySelector("#start-upload");
		submitButton.style.visibility = "hidden";
		var myDropzone = this;
	
		submitButton.addEventListener("click", function() {
			myDropzone.processQueue();
		});
		
		myDropzone.on("addedfile", function(file) {
			
			submitButton.style.visibility = "visible";
			
			console.log(file);
			
			var canvas = document.getElementById('imageCanvas');
			var ctx = canvas.getContext('2d');
			var img = new Image();
			img.src = window.URL.createObjectURL(file);
			img.onload = function(){
			  var ratio = img.width/img.height;
			  if (img.width > img.height){
				ctx.canvas.width = window.innerWidth/2;
				ctx.canvas.height = ctx.canvas.width/ratio;
			  } else{
				ctx.canvas.height = window.innerHeight/2;
				ctx.canvas.width = ctx.canvas.height*ratio;
			  }
			  ctx.drawImage(img,0,0,ctx.canvas.width,ctx.canvas.height);
			  console.log("here")
			}
			
			
		})
	},
}