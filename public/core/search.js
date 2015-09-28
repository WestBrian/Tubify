// ANGULAR FUNCTIONS
var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list1 = ['hey','sup'];
    $scope.searchList = ['search1','search2'];
    $scope.search = function(){
        //$scope.searchList.push($scope.searchField);
        searchVideo($scope.searchField);
        
    };
});

// Searches youtube api for video
function searchVideo(textInput){
    var q = textInput;
    var request = gapi.client.youtube.search.list({
        q: textInput,
        part: 'snippet',
        type: 'video'
    })

    request.execute(showResponse);
}

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    //storeVideoInfo(response);

    var mostRecentVideoId = response.items[0].id.videoId;
    
    //player.loadVideoById(mostRecentVideoId);
    console.log('Video loaded.');
}

// Storing current video in an array to be updated to database
