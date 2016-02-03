'use strict';

app.controller('ChatController', function($scope) {
	var scope = angular.element($("#main")).scope();
    $scope.users = ['user1', 'user2'];
    $scope.messages = [];
    $scope.name=localStorage.getItem("name");

    console.log($scope.name+' 1');
    console.log(username+' 2');
    console.log('sup');
    var tempUser;
    if(username!='guest'){
    		tempUser=username;
    	}
    if((!$scope.name && username=='guest')){
    	$('.name-container').show();
    	$('.name-field').focus();
    }
    else{
    	var nameMessage = {
    		name: tempUser || $scope.name,
    		room: scope.playlistField 
    	}
    	scope.socket.emit("store name", nameMessage);
    }
    
    $scope.changeName = function() {
    	$('.name-container').hide();
    	localStorage.setItem("name",$scope.nameInput);
    	
    	var nameMessage = {
    		name: tempUser || $scope.nameInput,
    		room: scope.playlistField 
    	}
    	scope.socket.emit("store name", nameMessage);
    };
    $scope.getUsers = function() {};
    $scope.getMessages = function() {};
    $scope.saveMessage = function() {
        var messageObject = {
            name: username || 'guest',
            message: $scope.chatInput,
            playlist: scope.playlistField
        }
        $scope.chatInput = '';
        scope.socket.emit('send message', messageObject);
        //$scope.messages.push(message);
    };

    // Socket functions

   scope.socket.on('userList', function(data) {   //for getting all messages
        console.log('userList mesasge');
        $scope.users=data;
        $scope.$apply();

    });
    scope.socket.on('message', function(data) {  //for single message
        console.log('received chat message');
        $scope.messages.push(data);
        $scope.$apply();
        $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
    });
    scope.socket.on('messages', function(data) {   //for getting all messages
        console.log('received chat message');
        $scope.messages=[];
        $scope.messages.push.apply($scope.messages, data.messages);
        $scope.users=data.users;

        $scope.$apply();
        $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);

    });
});
