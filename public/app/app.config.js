(function(){

var authenticate = ['$q', '$http', function ($q, $http) {
	var defer = $q.defer();
	$http.get('/authenticate')
		.then(function success(res) {
			defer.resolve(res.data.user);
		}, function reject(res) {
			console.log(res.status);
			defer.reject("not_logged_in");
		});

	return defer.promise;
}]

angular.module('mara-app')
	.config(['$routeProvider',
	function config($routeProvider) {
		
		$routeProvider.
		when('/', {
			template: '<log-in></log-in>',
		}).
		when('/notauthorized', {
			template: 'NOT AUTHORIZED', 
		}).
		when('/dashboard', {
			template: '<dashboard></dashboard>',
			resolve: {auth: authenticate},
		}).
		when('/collections/:id', {
			template: '<collection></collection>',
			resolve: {auth: authenticate},
		}).
		when('/collections/:id/targetupload', {
			template: '<target-upload></target-upload>',
			resolve: {auth: authenticate},
		}).
		when('/collections/:collectionid/target/:targetid/augmentupload', {
			template: '<augment-upload></augment-upload>',
			resolve: {auth: authenticate},
		}).
		otherwise('/');
		}
	])
	.run(['$rootScope', '$location', function($rootScope, $location) {
		$rootScope.$on("$routeChangeError", function(evt, current, previous, rejection) {
			if (rejection === "not_logged_in") {
				console.log("NOT LOGGED IN");
				$location.path('/notauthorized');
			}
		});
	}]);
	

}());