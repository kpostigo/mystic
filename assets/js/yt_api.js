/******************************************************************************\
 *                                                                            *
 *                          YOUTUBE API STUFF                                 *
 *                                                                            *
\******************************************************************************/


/*****************************  VARIABLES  ************************************/

// sentiment = processImage(image),

var player,
  video,
  done = false; // video is not done

/******************************************************************************/
/**************************** YOUTUBE IFRAME API  *****************************/
/******************************************************************************/

function loadiFrame() {
  // api loads through the script tag
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


// create an <iframe> and youtube player at #player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    color: 'white',
    controls: 1,
    iv_load_policy: 3,
    videoId: video,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}


// iFrame API calls this when video player is ready
function onPlayerReady(event) {
  event.target.stopVideo();
}


// iFrame API calls this when player state changes
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}


// self explanatory
function stopVideo() {
  player.stopVideo();
}