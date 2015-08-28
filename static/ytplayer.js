// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var videoId;
function setVideoId(id) {
  videoId = id;
  console.log('setVideoId:' + id + ':' + videoId);
}

// WebSocket Connection
var socket = io.connect('http://localhost:8888');

socket.on('connect', function() {
  console.log('connect');
});

socket.on('message', function(msg) {
  console.log(msg);
  $('#entrypoint').append($( msg.msg ));
});

socket.on('disconnect', function(){
  console.log('disconnect');
});

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
  console.log('player api ready');
  player = new YT.Player('ytplayer', {
    height: '390',
    width: '640',
    playerVars : {
      controls: '1', 
      autoplay: '0',
      disablekb: '0',
      fs: '0',
      loop: '0',
      rels: '0',
      showinfo:'0'
    },
    videoId: videoId,
    events: {
 //     'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }   
  });
}

function onPlayerStateChange(event) {
  var state = event.target.getPlayerState();
  if(state == YT.PlayerState.ENDED) {
    console.log('ended');
  }
  else if(state == YT.PlayerState.PLAYING) {
    console.log('playing');
    socket.emit('start');
  }
  else if(state == YT.PlayerState.PAUSED) {
    currentTime = player.getCurrentTime();
    console.log('paused:' + currentTime);
    socket.emit('pause', {currentTime : currentTime });
  }
  else if(state == YT.PlayerState.BUFFERING) {
    console.log('buffering');
    socket.emit('buffering');
  }
  else if(state == YT.PlayerState.CUED) {
    console.log('cued'); 
  }
}


