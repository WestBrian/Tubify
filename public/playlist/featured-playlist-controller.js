'use strict';

// -- Helper functions -- //

function prettyLog(somethingToLog) {
	console.log('--------------------------');
	console.log(somethingToLog);
	console.log('--------------------------');
}

// Remove any elements with empty titles
function removeBlankTitles(array) {
	var indexOfBlank = -1;
	var done = false;

	while(!done) {
		for(var i = 0; i < array.length; i++) {
			if(array[i].title === undefined || array[i].title === '') {
				indexOfBlank = i;
			}
		}

		if(indexOfBlank > -1) {
			array.splice(indexOfBlank, 1);
			indexOfBlank = -1;
			done = false;
		} else {
			done = true;
		}
	}

	return array;
}

function limitArrayTo(array, limit) {
	array.splice(limit, array.length);

	return array;
}

function arrayToUpperCase(array) {
	array.forEach(function(element) {
		element.title = element.title.toLowerCase();
	});

	return array;
}
var b;
app.controller('FeaturedPlaylistController', function($scope, $http) {

	// Properties
	$scope.featuredPlaylists = [];
	var limit = 10;

	// -- Playlist functions -- //

	// Load all playlists
	$http.get('/p', {}).then(function(response) {
		//maybe should switch to socket
		$scope.featuredPlaylists = response.data;
		$scope.featuredPlaylists = removeBlankTitles($scope.featuredPlaylists);
		$scope.trendingPlaylists=JSON.parse(JSON.stringify($scope.featuredPlaylists));// = $.extend( true, {}, $scope.featuredPlaylists );
		$scope.featuredPlaylists = limitArrayTo($scope.featuredPlaylists, limit);
		//$scope.featuredPlaylists = $scope.featuredPlaylists.splice(limit,$scope.featuredPlaylists.length);
		$scope.featuredPlaylists = arrayToUpperCase($scope.featuredPlaylists);
		//$scope.trendingPlaylists = $scope.featuredPlaylists;
		 
		 
		 
		$scope.trendingPlaylists = $.map($scope.trendingPlaylists, function(value, index) {
			return [value];
		});
	//	console.log(array[0]);

		$scope.trendingPlaylists.sort(function(a, b) {
   		return parseFloat(b.playCountWeekly) - parseFloat(a.playCountWeekly);
});
		//  $scope.trendingPlaylists.sort(sort_by('playCount', false, parseInt));
		 $scope.trendingPlaylists = limitArrayTo($scope.trendingPlaylists, 12);
		console.log($scope.trendingPlaylists);
		 console.log('zzzxz');
		  $scope.trendingPlaylists
		//  $scope.trendingPlaylists[0].title='sup';
	
	}, function(err) {
		$scope.featuredPlaylists.push('Error fetching the featured playlist.');
	});

	// Load clicked playlist
	$scope.loadPlaylist = function(index) {
		//var playlistPath = 'http://localhost:3000/p/' + $scope.featuredPlaylists[index].title;
		var scope = angular.element($("#main")).scope();

        scope.playlistField = $scope.featuredPlaylists[index].title;

        //$scope.socket.emit('join', $scope.featuredPlaylists[index].title);
        //$scope.$apply();
        //localStorage.setItem("playlist", $scope.featuredPlaylists[index].title);
        scope.playlistChange();
	
        // comment
        // another comment

		//window.location.href = playlistPath;
	}
	$scope.loadTrendingPlaylist = function(index) {
		//var playlistPath = 'http://localhost:3000/p/' + $scope.featuredPlaylists[index].title;
		var scope = angular.element($("#main")).scope();

        scope.playlistField = $scope.trendingPlaylists[index].title;

        //$scope.socket.emit('join', $scope.featuredPlaylists[index].title);
        //$scope.$apply();
        //localStorage.setItem("playlist", $scope.featuredPlaylists[index].title);
        scope.playlistChange();
	}

});
