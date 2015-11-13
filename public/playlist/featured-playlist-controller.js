'use strict';

// -- Helper functions -- //

// Remove any elements with empty titles
function removeBlankTitles(array) {
	var indexOfBlank = -1;

	for(var i = 0; i < array.length; i++) {
		if(array[i].title === undefined) {
			indexOfBlank = i;
		}
	}

	if(indexOfBlank > -1) {
		array.splice(indexOfBlank, 1);
	}
	return array;
}

app.controller('FeaturedPlaylistController', function($scope, $http) {
	
	// Properties
	$scope.featuredPlaylists = [];

	// -- Playlist functions -- //

	// Load all playlists
	$http.get('/p', {}).then(function(response) {
		$scope.featuredPlaylists = response.data;
		$scope.featuredPlaylists = removeBlankTitles($scope.featuredPlaylists);
	}, function(err) {
		$scope.featuredPlaylists.push('Error fetching the featured playlist.');
	});

	// Load clicked playlist
	$scope.loadPlaylist = function(index) {
		var playlistPath = 'http://localhost:3000/p/' + $scope.featuredPlaylists[index].title;

		window.location.href = playlistPath;
	}

});