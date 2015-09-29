var timer;
var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list1 = ['hey','sup'];
    $scope.searchList = [];

    $scope.search = function(){
        
            var query = $scope.searchField;

        var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video'
        });
        if($scope.searchField!=''){
            request.execute(function(response){
                console.log(response.items[0]);
                $scope.searchList=[];
                for(var i = 0; i < Math.min(response.items.length, 3); i++){
                    var obj = {
                        title: response.items[i].snippet.title,
                        thumb: response.items[i].snippet.thumbnails.medium.url
                    };
                    $scope.searchList.push(obj);
                }
                $scope.$apply();
            });
        }
    };
});