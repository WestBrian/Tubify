// ANGULAR FUNCTIONS
var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list = [];

    $scope.search = function(){
        $scope.list.push($scope.searchField);
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
    storeVideoInfo(response);

    var mostRecentVideoId = response.items[0].id.videoId;
    
    //player.loadVideoById(mostRecentVideoId);
    console.log('Video loaded.');
}

// Storing current video in an array to be updated to database
 var dbvideoID = 0;
function storeVideoInfo(response){
   
    var videoTitle = response.items[0].snippet.title;
    var videoID1 = response.items[0].id.videoId;
    var videoID2 = response.items[1].id.videoId;
    var videoID3 = response.items[2].id.videoId;

    var addedVid = []; // create an empty array
    addedVid={
        "URL1": response.items[0].id.videoId,
        "URL2": response.items[1].id.videoId,
        "URL3": response.items[2].id.videoId,
        "searchTerm": searchTermText ,//searchTermText,
        "title": videoTitle,
        "playlistName": $('#playlist-search').val()
    };
    
    localStorage.setItem('addedVid', JSON.stringify(addedVid));
    $.ajax({
                type: "POST",
                dataType: "json",
                url: "./php/add.php",
                cache: false,
                data:{myData:JSON.parse(localStorage.getItem('addedVid'))},// {myData:dataString},
                success: function(data){
                    console.log("video id is: " + data);
                    dbvideoID = data;
                },
                error: function(e){
                    console.log(e);
                    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
                }
            });
    
    var currentVideo = [dbvideoID, videoID1, videoID2, videoID3, searchTermText, videoTitle];
    currentPlaylist.push(currentVideo);
    localStorage.setItem('currentPlaylist', JSON.stringify(currentPlaylist));
    loadPlaylist(currentPlaylist);
}