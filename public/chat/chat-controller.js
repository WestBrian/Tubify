'use strict';

app.controller('ChatController', function($scope) {
    $scope.users = ['user1', 'user2', 'user3'];
    $scope.messages = ['msg1', 'msg2'];
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
        $scope.messages.push(data.name + ': ' + data.message);
        $scope.$apply();
    });
});
