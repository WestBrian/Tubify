'use strict';

app.controller('ChatController', function($scope) {
    $scope.users = ['user1', 'user2', 'user3'];
    $scope.messages = ['msg1', 'msg2'];

    $scope.getUsers = function() {};
    $scope.getMessages = function() {};
    $scope.saveMessage = function() {
        var message = $scope.chatInput;
        $scope.chatInput = '';

        $scope.messages.push(message);
    };
});
