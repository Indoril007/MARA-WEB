

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
			img.src = window.URL.createObjectURL(file);
			// var img = document.createElement("img");
			// img.src = window.URL.createObjectURL(file);
			// img.height = 80;
			// // img.onload = function() {
				// // // window.URL.revokeObjectURL(this.src);
			// // }
			
			// var imgholder = document.getElementById("imgholder");
			// imgholder.appendChild(img);
			
			
		})
	},
}

// Define the `PhoneListController` controller on the `phonecatApp` module
// app.controller('PhoneListController', function PhoneListController($scope) {
  // $scope.phones = [
    // {
      // name: 'Nexus S',
      // snippet: 'Fast just got faster with Nexus S.'
    // }, {
      // name: 'Motorola XOOM™ with Wi-Fi',
      // snippet: 'The Next, Next Generation tablet.'
    // }, {
      // name: 'MOTOROLA XOOM™',
      // snippet: 'The Next, Next Generation tablet.'
    // }
  // ];
// });