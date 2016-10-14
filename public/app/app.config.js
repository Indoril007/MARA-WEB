(function(){
	
angular.module('mara-app')
	.config(['$routeProvider',
	function config($routeProvider) {
		
		$routeProvider.
		when('/', {
			template: '<log-in></log-in>'
		}).
		when('/targetupload', {
			template: '<target-upload></target-upload>'
		}).
		otherwise('/');
		}
	]);

}());