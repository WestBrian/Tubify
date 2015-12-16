'use strict';

// -- Helper functions -- //

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

app.controller('FeaturedPlaylistController', function($scope, $http) {
	
	// Properties
	$scope.featuredPlaylists = [];
	const limit = 20;

	// -- Playlist functions -- //

	// Load all playlists
	$http.get('/p', {}).then(function(response) {
		console.log('this shoudlnt be used');
		$scope.featuredPlaylists = response.data;
		$scope.featuredPlaylists = removeBlankTitles($scope.featuredPlaylists);
		$scope.featuredPlaylists = limitArrayTo($scope.featuredPlaylists, limit);
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

});