var app = angular.module('tubify', []);

app.controller('CoreController', function($scope){
    var searchText = $scope.searchField;
    $scope.list1 = ['hey','sup'];
    $scope.searchList = [];

    $scope.search = function(){
        $scope.searchList=[];
        var query = $scope.searchField;

        var request = gapi.client.youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'video'
        });
        if($scope.searchField!=''){
        request.execute(function(response){
           // console.log(response.items[0].id.videoId);
            for(var i = 0; i < response.items.length; i++){
                var obj = {
                    title: response.items[i].snippet.title,
                    thumb: response.items[i].snippet.thumbnails.default.url
                };
                $scope.searchList.push(obj);
            }
            $scope.$apply();
        });
    }
    };
});