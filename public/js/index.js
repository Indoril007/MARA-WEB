
(function() {

	var app = angular.module('app', ['bp.img.cropper']);

	var dropzone = document.getElementById("dropzone")

	dropzone.addEventListener("dragover", dragOver, false);
	dropzone.addEventListener("dragleave", dragLeave, false);
	dropzone.addEventListener("drop", drop, false);

	function dragOver(e) {
		e.preventDefault();
		dropzone.className = "drag-hover";
	}

	function dragLeave(e) {
		e.preventDefault();
		dropzone.className = "";
	}

	function drop(e) {
		e.preventDefault();
		dropzone.className = "";
		var file = e.dataTransfer.files[0];
		upload(file);
	}

	function upload(file) {
		var imgurl = window.URL.createObjectURL(file);
		
		$("#image-cropper").attr("ng-src", imgurl);
		$("#image-cropper").attr("crop-show", "True");
	}
	
	// app.controller('cropController', function() {
		
	// });

})();