(function(){
	
angular.module('mara-app')
	.config(['$routeProvider',
	function config($routeProvider) {
		
		$routeProvider.
		when('/', {
			template: '<log-in></log-in>'
		}).
		when('/dashboard', {
			templateUrl: 'dash-board'
		}).
		when('/targetupload', {
			templateUrl: 'target-upload'
		}).
		when('/augmentupload', {
			templateUrl: 'augment-upload'
		}).
		otherwise('/');
		}
	]);

}());