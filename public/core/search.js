'use strict';

//var app = angular.module('tubify', []);
var latestSearchResponse;
var socketRoom='';


app.controller('CoreController', function($scope){
    var socket = io();
    socket.on('addVid', function(msg) {     
        console.log("received addedvid message");  
        console.log(msg.title+msg.urlId);  

        var obj = {
                        title: msg.title,
                        urlId: msg.urlId,
                        thumb: msg.thumb,
                        searchString: msg.searchString
                    };


        $scope.list1.push(obj);
        player.loadVideoById(msg.urlId);
        $scope.$apply();
    });
    socket.on('playlist', function(msg){
        console.log('heyheyhey');
        $scope.list1=msg;
        $scope.$apply();
    });

    var searchText = $scope.searchField;
    var realCounter=0;
    $scope.list1 = [];
    $scope.searchList = [];
    $scope.counter=0;
    $scope.playlistIndex=0;
    var playlistFromStorage=localStorage.getItem("playlist");
    if(playlistFromStorage!=null){
        $scope.playlistField=playlistFromStorage;
        socket.emit('join',$scope.playlistField);


    }
    startPlayer();

    $scope.search = function(){
        // Resetting variables
        //socket.broadcast.to(socketRoom).emit('addedVid',$scope.searchField);
        //socket.emit('addedVid',$scope.searchField);
        
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

        if ($event.keyCode == 13) {
            $scope.playVideo();
        }

    };
  
    $scope.playVideo = function(){   //gets called when clicking a searched video, or pressing enter
        console.log('play video');
        var data = {
            title: $scope.searchList[$scope.counter].title,
            urlId: $scope.searchList[$scope.counter].videoId,
            thumb: $scope.searchList[$scope.counter].thumb,
            searchField: $scope.searchField,


            room: $scope.playlistField
        };
        console.log('emitted addedvid');
        socket.emit('addedVid', data);


        $scope.searchField = '';
        $scope.searchList = [];

    };



    $scope.onScroll = function($event){
        var realLength=latestSearchResponse.items.length;
        //console.log('onscroll called');
        //console.log(event);
       // console.log(event.wheelDelta);
        if (event.wheelDelta>0){
            console.log('scrolled up');
            if (realCounter-$scope.counter>0){
                realCounter--;
                var obj = {
                    title: latestSearchResponse.items[realCounter+(0-$scope.counter)].snippet.title,
                    thumb: latestSearchResponse.items[realCounter+(0-$scope.counter)].snippet.thumbnails.medium.url,
                    videoId: latestSearchResponse.items[realCounter+(0-$scope.counter)].id.videoId
                };
                $scope.searchList.pop();
                $scope.searchList.unshift(obj);

            }

        }
        else{
            console.log('scrolled down');
            if (realCounter-$scope.counter+2<realLength-1){
                realCounter++;
                var obj = {
                    title: latestSearchResponse.items[realCounter+(2-$scope.counter)].snippet.title,
                    thumb: latestSearchResponse.items[realCounter+(2-$scope.counter)].snippet.thumbnails.medium.url,
                    videoId: latestSearchResponse.items[realCounter+(2-$scope.counter)].id.videoId
                };
                $scope.searchList.shift();
                $scope.searchList.push(obj);

            }
        }
        // console.log($event.originalEvent.wheelDelta+' again');
    };

    $scope.enterSearchList = function(index){
        console.log(index); 
        realCounter=realCounter+index-$scope.counter;
        $scope.counter=index;
    };
    $scope.playClickedVideo= function(index){
        $scope.playlistIndex=index;
        player.loadVideoById($scope.list1[index].urlId);
    };

    $scope.playlistChange = function(){
        console.log('yo');
        console.log($scope.searchField);
        socket.emit('join',$scope.playlistField);
        localStorage.setItem("playlist", $scope.playlistField);

        /*if(socketRoom==''){
            socket.join($scope.playlistField);
            socketRoom=$scope.playlistField;
        }
        else{
            socket.leave(socketRoom);
            socket.join($scope.playlistField);
            socketRoom=$scope.playlistField;
        }
        */
    };
});



$(document).on("keydown keyup", ".searchBox", function(event) { 
    if(event.which==38 || event.which==40){
        event.preventDefault();
    }
});

app.directive('ngScroll', function () {
    return function (scope, element, attrs) {
        element.bind("mousewheel", function (event) {
            if(event) {
                scope.$apply(function (){
                    //console.log(event.originalEvent.wheelDelta);
                    scope.$eval(attrs.ngScroll);
                });

                //event.preventDefault();
            }
        });
    };
});

$(function() {
    $( "#sortable" ).sortable({
        update: function(event, ui) { 
            console.log('update: '+ui.item.index())
        },
        start: function(event, ui) { 
            console.log('start: ' + ui.item.index())
        }
    });
    $( "#sortable" ).disableSelection();
    console.log('sortable');
});
    

