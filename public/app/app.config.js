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
		otherwise('/');
		}
	]);

}());