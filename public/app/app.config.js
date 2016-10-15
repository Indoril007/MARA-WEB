(function(){
	
angular.module('mara-app')
	.config(['$routeProvider',
	function config($routeProvider) {
		
		$routeProvider.
		when('/', {
			template: '<log-in></log-in>'
		}).
		when('/targetupload', {
			templateUrl: 'target-upload'
		}).
		when('/augmentupload', {
			template: '<augment-upload></augment-upload>'
		}).
		otherwise('/');
		}
	]);

}());