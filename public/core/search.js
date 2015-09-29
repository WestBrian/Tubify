'use strict';

var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list1 = [];
    $scope.searchList = [];
    $scope.counter=0;

    $scope.search = function(){
        // Resetting variables
        $scope.counter = 0;
        $scope.searchList = [];
        
        var query = $scope.searchField;

        var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video'
        });

        if($scope.searchField != ''){
            request.execute(function(response){
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
        if ($event.keyCode == 38) {
            if ($scope.counter > 0) {
                $scope.counter--;
            }else{
                $scope.counter = 2;
            }
        }
        if ($event.keyCode == 40) {
            if ($scope.counter < 2) {
                $scope.counter++;
            }else{
                $scope.counter = 0;
            }
        }
    };

    $scope.playVideo = function(){
        $scope.list1.push($scope.searchList[$scope.counter].title);
        player.loadVideoById($scope.searchList[$scope.counter].videoId);
    };
});