'use strict';

var app = angular.module('tubify', []);
var latestSearchResponse;

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    var realCounter=0;
    $scope.list1 = [];
    $scope.searchList = [];
    $scope.counter=0;

    $scope.search = function(){
        // Resetting variables
        realCounter=0;
        $scope.counter = 0;
        $scope.searchList = [];
        
        var query = $scope.searchField;

        var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video',
            maxResults: '15'
        });

        if($scope.searchField != ''){
            request.execute(function(response){
                latestSearchResponse=response;
                console.log(response.items[0]);
                $scope.searchList = [];
                for(var i = 0; i < Math.min(response.items.length, 3); i++){
                    var obj = {
                        title: response.items[i].snippet.title,
                        thumb: response.items[i].snippet.thumbnails.medium.url,
                        videoId: response.items[i].id.videoId
                    };
                    $scope.searchList.push(obj);
                }
                $scope.$apply();
            });
        }
    };

    $scope.displayKey = function($event){
        var realLength=latestSearchResponse.items.length;
        if ($event.keyCode == 38) {
            if ($scope.counter > 0) {
                $scope.counter--;
                realCounter--;
            }else{
                $scope.counter = 0;
                if(realCounter>0){
                    realCounter--;
                    var obj = {
                        title: latestSearchResponse.items[realCounter].snippet.title,
                        thumb: latestSearchResponse.items[realCounter].snippet.thumbnails.medium.url,
                        videoId: latestSearchResponse.items[realCounter].id.videoId
                    };
                    $scope.searchList.pop();
                    $scope.searchList.unshift(obj);
                }
            }
        }
        if ($event.keyCode == 40) {
            if ($scope.counter < Math.min(2,realLength-1)) {
                $scope.counter++;
                realCounter++;
            }else{
                $scope.counter = Math.min(2,realLength-1);
                if(realCounter<realLength-1){
                    realCounter++;
                    var obj = {
                            title: latestSearchResponse.items[realCounter].snippet.title,
                            thumb: latestSearchResponse.items[realCounter].snippet.thumbnails.medium.url,
                            videoId: latestSearchResponse.items[realCounter].id.videoId
                        };
                    $scope.searchList.shift();
                    $scope.searchList.push(obj);
                }
            }
        }
    };

    $scope.playVideo = function(){
        $scope.list1.push($scope.searchList[$scope.counter].title);
        player.loadVideoById($scope.searchList[$scope.counter].videoId);
        $scope.searchField = '';
        $scope.searchList = [];
    };
});

$(document).on("keydown keyup", ".searchBox", function(event) { 
    if(event.which==38 || event.which==40){
        event.preventDefault();
    }
});