

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