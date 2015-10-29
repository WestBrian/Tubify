'use strict'

// Creating the angular app variable
var app = angular.module('Tubify', ['ngRoute']);

// Creating the layout controller
app.controller('LayoutController', function($scope) {});

// Configuring the routes
/*app.config(function($routeProvider) {
	$routeProvider
		// Login
		.when('/login', {
			templateUrl : '../build/views/public/login/login.html',
			controller : 'LoginController'
		})
		// Home
		.when('/', {
			templateUrl : '../build/views/public/core/index.html',
			controller : 'CoreController'
		});
});*/

/*
	Notes:
		- I either need to serve the build folder or find a better way to compile the Jade files.
*/