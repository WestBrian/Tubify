'use strict';

app.controller('ChatController', function($scope) {
    $scope.users = [];
    $scope.messages = [];
    var scope = angular.element($("#main")).scope();

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
    scope.socket.on('message', function(data) {
        console.log('received chat message');
        $scope.messages.push(data.name + ': ' + data.message);
        $scope.$apply();
    });
});
