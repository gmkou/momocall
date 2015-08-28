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
  }
  else if(state == YT.PlayerState.PAUSED) {
    console.log('paused:' + player.getCurrentTime() ); 
  }
  else if(state == YT.PlayerState.BUFFERING) {
    console.log('buffering'); 
  }
  else if(state == YT.PlayerState.CUED) {
    console.log('cued'); 
  }
}

