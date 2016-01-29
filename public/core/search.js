'use strict';

//var app = angular.module('tubify', []);
var latestSearchResponse;
var socketRoom='';

var socketMessages = {
    playlistChange: 'change order successful',
    syncedUser: 'Sync'
}

/* Classes in Javascript Example */

// Video class
function Video(title, videoUrl, order) {
    this.title = title;
    this.videoUrl = videoUrl
    this.order = order

    this.setOrder = function(order) {
        this.order = order
    }

    this.getInfo = function() {
        return (title + ", " + videoUrl)
    }
}

/* End Example */

app.controller('CoreController', function($scope){

    // Properties
    $scope.searchList = ['...'];

    // Playlist highlighting
    $scope.playlistCounter = 0;

    $scope.enterPlaylistList = function(index) {
        if(index != $scope.indexList[$scope.playlistIndex]) {
            $scope.playlistCounter = index;
        }
    };
    $scope.leavePlaylistList = function(index) {
        $scope.playlistCounter = null;
    };
    $scope.socket = io();
    $scope.sync=false;


    $scope.socket.on('sync play video', function(data) {
        console.log('playing video index '+data.index);

        $scope.playlistIndex=$scope.indexList.indexOf(data.index);
        player.loadVideoById($scope.list1[data.index].urlId);
        $scope.$apply();

    });
    $scope.socket.on('receiveSync', function(username) {
        console.log('User: ' + username + ' has joined.');
    });

    $scope.socket.on('change order successful', function(msg) { 
        //$scope.playlistIndex=$scope.indexList[$scope.playlistIndex];
        console.log('changing order zzzzzzzzzzzzzzzzzzzzzz');
        $scope.playlistIndex=msg.indexList[$scope.playlistIndex];
        
        $scope.playlistChange();
        $scope.$apply();
    });

    $scope.socket.on('delete successful', function(msg) { 
        console.log('deleting video');
        $scope.playlistChange();
        $scope.$apply();
    });
    $scope.socket.on('addVid', function(msg) {     
        console.log("received addedvid message");  
        console.log(msg.title+msg.urlId);  

        var obj = {
                        title: msg.title,
                        urlId: msg.urlId,
                        thumb: msg.thumb,
                        searchString: msg.searchString
                    };


        $scope.list1.push(obj);
        //player.loadVideoById(msg.urlId);
        $scope.indexList=[];
        for (var i = 0; i <$scope.list1.length; i++) {
            $scope.indexList.push(i);
        }

        $scope.$apply();
    });
    $scope.socket.on('playlist', function(msg){
        console.log('playlist');
        //$scope.playlistIndex=msg.indexList[$scope.playlistIndex];
        if (typeof msg.indexList !== 'undefined') {
            $scope.playlistIndex=msg.indexList.indexOf($scope.playlistIndex);
        }
        if (typeof msg.index !== 'undefined') {
            if (msg.index<$scope.playlistIndex){
                $scope.playlistIndex--;
            }
            else if(msg.index==$scope.playlistIndex){
                $scope.playlistIndex=null;
            }
        }
        //$scope.list1=msg[0];
        $scope.list1=[];
        $scope.indexList=[];
        for (var i = 0; i <msg.list.length; i++) {
            $scope.indexList.push(i);
            $scope.list1.push(msg.list[msg.order[i]]);
        }
        window.history.pushState("object or string", "Title", "/p/"+$scope.playlistField);
        $scope.$apply();
    });
    $scope.socket.on('playlist first', function(msg){

        //$scope.list1=msg[0];
        $scope.list1=[];
        $scope.indexList=[];
        for (var i = 0; i <msg.list.length; i++) {
            $scope.indexList.push(i);
            $scope.list1.push(msg.list[msg.order[i]]);
        }
        startPlayer();
        $scope.$apply();
    });

    $scope.repeat=false;
    var searchText = $scope.searchField;
    var realCounter=0;
    $scope.list1 = [];
    $scope.searchList = [];
    $scope.counter=0;
    $scope.playlistIndex=0;
    $scope.indexList=[];
    var playlistFromStorage=localStorage.getItem("playlist");
    if(pl!=""){
        $scope.playlistField=pl;
        $scope.socket.emit('join first',$scope.playlistField);    
    }
    else if(playlistFromStorage!=null){
        $scope.playlistField=playlistFromStorage;
        $scope.socket.emit('join first',$scope.playlistField);    
    }
    else{
        startPlayer();    
    }

    $scope.toggleRepeat = function(){
        $scope.repeat=!$scope.repeat;

    }

    $scope.search = function(){
        // Resetting variables
        //$scope.socket.broadcast.to($scope.socketRoom).emit('addedVid',$scope.searchField);
        //$scope.socket.emit('addedVid',$scope.searchField);

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

        if($scope.searchField != '' && $scope.searchField != null){
            console.log('showing');
            $(".ddm").show();
            request.execute(function(response){
                latestSearchResponse=response;
                //console.log(response.items[0]);
                $scope.searchList = [];
                //$scope.searchResults = [];
                for(var i = 0; i < Math.min(response.items.length, 3); i++){
                    var obj = {
                        title: response.items[i].snippet.title,
                        thumb: response.items[i].snippet.thumbnails.medium.url,
                        videoId: response.items[i].id.videoId
                    };
                    //$scope.searchResults.push(obj);
                    $scope.searchList.push(obj);
                }
                $scope.$apply();
            });
        } 
        else if($scope.searchField == '') {
            $('.ddm').hide();
        }
    };

    $scope.displayKey = function($event){
        var realLength=latestSearchResponse.items.length;
        if ($event.keyCode == 38) {
            $event.preventDefault();
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
            $event.preventDefault();
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
        if ($event.keyCode == 27) { // escape
            document.activeElement.blur();
        }
        if ($event.keyCode == 13) {  //enter
            $scope.playVideo();
        }

    };

    $scope.addVideo = function() {
        var data = {
            title: $scope.searchList[$scope.counter].title,
            urlId: $scope.searchList[$scope.counter].videoId,
            thumb: $scope.searchList[$scope.counter].thumb,
            searchField: $scope.searchField,
            room: $scope.playlistField
        }
    }

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
        $scope.socket.emit('addedVid', data);


        $scope.searchField = '';
        $scope.searchList = [];

    };

    $scope.sync2 = function() {
        // Properties
        $scope.sync= !$scope.sync;
        var data = {
            'username': username,
            'playlist': $scope.playlistField,
            'syncing':$scope.sync
        };
        
        // Emit message
        $scope.socket.emit('sync', data);
    }

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
        //$scope.playlistIndex=index;
       // player.loadVideoById($scope.list1[$scope.indexList[index]].urlId);
       console.log(index);
        $scope.playlistIndex=$scope.indexList.indexOf(index);
        player.loadVideoById($scope.list1[index].urlId);


        var data = {
            playlist:$scope.playlistField,
            index:$scope.playlistIndex


        };
        if($scope.sync){
           $scope.socket.emit('sync play video', data);
        }
        //$scope.$apply();


    };

    $scope.playlistChange = function(){
        if($scope.sync) {
            $scope.sync = false;
        }

        $scope.socket.emit('join', $scope.playlistField);
        
        localStorage.setItem("playlist", $scope.playlistField);

        /*if($scope.socketRoom==''){
            $scope.socket.join($scope.playlistField);
            $scope.socketRoom=$scope.playlistField;
        }
        else{
            $scope.socket.leave($scope.socketRoom);
            $scope.socket.join($scope.playlistField);
            $scope.socketRoom=$scope.playlistField;
        }
        */
    };
    
    $scope.deleteVideo = function(index){
        var data={
            playlist:$scope.playlistField,
            list: $scope.indexList,
            index: index 
        };
        $scope.socket.emit('delete video', data );
    };
});



$(document).on("keydown keyup", ".searchBox", function(event) { 
    if(event.which==38 || event.which==40){
        event.preventDefault();
    }
});
$(document).on("keyup", function(event) { 
    if(event.keyCode==13){
        if ($(".chat-field").is(":focus")) {

        }
        else{
            document.activeElement.blur();
        }
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
    $(".ddm").dropdown('toggle');
    $(".ddm").hide();
    $("#search").click(function(e){
        console.log('Clicked 1');
        e.preventDefault();
        if(($('#search').val() == null) || ($('#search').val() == '')){
            console.log('NULL 2');

            $('.ddm').hide();
        }
    });

    // // Remake of sortable method
    // var scope = angular.element($('#main')).scope();

    // $('#sortable').sortable({
    //     update: function(event, ui) {
    //     },
    //     start: function(event, ui) {
    //     }
    // });

    // Making video list "sortable"
    var scope = angular.element($("#main")).scope();
    var a;
    $( "#sortable" ).sortable({

        update: function(event, ui) { 
            console.log(scope.indexList);
            console.log('update: '+ui.item.index())
            console.log('update from: '+a);
            
            if (a<ui.item.index()){
                var temp=scope.indexList[a];
                for (var i = a; i <= ui.item.index()-1; i++) { 
                    scope.indexList[i]=scope.indexList[i+1];
                }
                scope.indexList[ui.item.index()]=temp;
            }
            
            else if(a>ui.item.index()){
                var temp=scope.indexList[a];
                for (var i = a; i >= ui.item.index()+1; i--) { 
                    scope.indexList[i]=scope.indexList[i-1];
                }
                scope.indexList[ui.item.index()]=temp;   
            }
            console.log(scope.indexList);
            var data={
                playlist:scope.playlistField,
                indexList:scope.indexList

            }

            scope.socket.emit('changeOrder',data);

        },
        start: function(event, ui) { 
            a=ui.item.index()
            console.log('start: ' + ui.item.index())
        },
    });
    $( "#sortable" ).disableSelection();
    console.log('sortable');
});
function blurFunction(){
    console.log('blur function');
    document.activeElement.blur();
    if ($('.ddm:hover').length == 0) {
    // do something ;)
        $('.ddm').hide();
    }
    

}


function unBlurFunction(){
    console.log('focus function');
    //get scope and check if search has anything in it and if it does then do $("#ddm").show()
    var scope = angular.element($('#main')).scope();
    if(scope.searchField!="" && scope.searchField != null){
        console.log(scope.searchField);
        console.log('show');
        $('.ddm').show();
    }
    
}

$(document).on("keyup", function(event) { 

    if ($('*:focus').length == 0) {
        if(event.keyCode==80 || event.keyCode==49){  //p key
       
     //do Something

            console.log('p key');
            document.getElementById("playlistField").focus();
            document.getElementById("playlistField").select();
        }
        if(event.keyCode==83 || event.keyCode==50){  //s key
       
     //do Something

            document.getElementById("search").focus();
            document.getElementById("search").select();
        }
    }
    if (event.keyCode == 27) { // escape
        document.activeElement.blur();
    }

    
});