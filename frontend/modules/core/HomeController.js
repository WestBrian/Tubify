'use strict';

var app = angular.module('myApp', []);

app.controller('HomeController', function($scope, $http){
	$scope.names = [
		'Brian',
		'Dan',
		'John'
	];

	$scope.updateArray = function(){
		$scope.names.push($scope.songBox);
	}
});