
function startPlayer(){
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  var scope = angular.element($("#main")).scope();
  var vid = 'M7lc1UVf-VE';
  if (scope.list1.length>0){
    vid=scope.list1[0].urlId;
  }
  player = new YT.Player('player', {
    height: '390',
    width: '640',
   videoId: vid,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

/*
function startYoutube() {
  var scope = angular.element($("#main")).scope();
  var vid = 'M7lc1UVf-VE';
  if (scope.list1.length>0){
    vid=scope.list1[0].urlId;
  }
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: vid,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
*/
// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

  event.target.playVideo();
  console.log("player ready");
}
var done = false;
function onPlayerStateChange(event){
    console.log(event);
     var scope = angular.element($("#main")).scope();
    if(event.data == done){
        if(scope.repeat==false){
          if((scope.playlistIndex == scope.list1.length - 1) || scope.playlistIndex==null){
              scope.playlistIndex = 0;
          }else{
              scope.playlistIndex += 1;
          }
          console.log(scope.indexList[scope.playlistIndex]);
          console.log(scope.playlistIndex);
          player.loadVideoById(scope.list1[scope.indexList[scope.playlistIndex]].urlId);
          scope.$apply();
        }
        else{
          player.seekTo(0);
        }
    }
}


// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.


function stopVideo() {
  player.stopVideo();
}

