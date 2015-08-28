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
    socket.emit('command', {commandType:'setVideoId', commandAttr:videoId});
});

socket.on('event', function(event) {
  console.log(event);
  if (event.eventType == 'message') {
    $('#entrypoint').prepend(event.eventAttr);
  }
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
    socket.emit('command', {commandType:'ended', commandAttr:''});
  }
  else if(state == YT.PlayerState.PLAYING) {
    console.log('playing');
    socket.emit('command', {commandType:'playing', commandAttr:''});
  }
  else if(state == YT.PlayerState.PAUSED) {
    currentTime = player.getCurrentTime();
    console.log('paused:' + currentTime);
    socket.emit('command', {commandType:'paused', commandAttr:currentTime});
  }
  else if(state == YT.PlayerState.BUFFERING) {
    console.log('buffering');
    socket.emit('command', {commandType:'buffering', commandAttr:''});
  }
  else if(state == YT.PlayerState.CUED) {
    socket.emit('command', {commandType:'cued', commandAttr:''});
  }
}


