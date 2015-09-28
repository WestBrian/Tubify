var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list1 = ['hey','sup'];
    $scope.searchList = ['search1','search2'];

    $scope.search = function(){
        var query = $scope.searchField;

        var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video'
        });

        request.execute(function(response){
            console.log(response);
        });
    };
});