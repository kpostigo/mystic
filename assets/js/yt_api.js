/******************************************************************************\
 *                                                                            *
 *                          YOUTUBE API STUFF                                 *
 *                                                                            *
\******************************************************************************/


/*****************************  VARIABLES  ************************************/

var sentiment = 'happy';


function randomize() {
  return randomnumber = Math.floor(Math.random() * maxResults + 1);
}


/******************************************************************************/
/***************************** YOUTUBE DATA API  ******************************/
/******************************************************************************/

// restrict api key before publishing
var playlist,
  dataAPI_key = 'AIzaSyC6IMRpjLTVrKcquFMtbqhSB-by1Lp1sNU',
  dataURI = `https://www.googleapis.com/youtube/v3/search?key=${dataAPI_key}&`,
  part = 'snippet',
  maxResults = 20,
  order = 'viewCount',
  search = sentiment + " hip hop",
  type = 'playlist';

var part_URI = `part=${part}&`,
  type_URI = `type=${type}`,
  maxResults_URI = `maxResults=${maxResults}&`,
  order_URI = `order=${order}&`,
  search_URI = `q=${search}&`,
  dataAPI = dataURI + part_URI + maxResults_URI + order_URI + search_URI + type_URI;

var player,
  done = false; // video is not done

$.ajax({
  url: dataAPI
}).then(function (response) {
  let num = randomize();
  playlist = response.items[num].id.playlistId;
  console.log(num);
  console.log(response);
});

loadiFrame();

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
    height: 390,
    width: 640,
    controls: 1,
    iv_load_policy: 3,
    playerVars: {
      listType: 'playlist',
      list: playlist
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}


// iFrame API calls this when video player is ready
function onPlayerReady(event) {
  event.target.stopVideo();
}


// self explanatory
function stopVideo() {
  player.stopVideo();
}
