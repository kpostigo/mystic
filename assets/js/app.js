/******************************************************************************\
 *                                                                            *
 *                          YOUTUBE API STUFF                                 *
 *                                                                            *
\******************************************************************************/


/*****************************  VARIABLES  ************************************/

function randomize() {
    return randomnumber = Math.floor(Math.random() * maxResults + 1);
}


/******************************************************************************/
/***************************** YOUTUBE DATA API  ******************************/
/******************************************************************************/

// restrict api key before publishing
var playlist,
    search,
    analyze = false,
    dataAPI_key = 'AIzaSyC6IMRpjLTVrKcquFMtbqhSB-by1Lp1sNU',
    dataURI = `https://www.googleapis.com/youtube/v3/search?key=${dataAPI_key}&`,
    part = 'snippet',
    maxResults = 20,
    order = 'viewCount',
    type = 'playlist';

var part_URI = `part=${part}&`,
    type_URI = `type=${type}`,
    maxResults_URI = `maxResults=${maxResults}&`,
    order_URI = `order=${order}&`;

var player,
    done = false; // video is not done

// search string
var queryString;


function loadYouTube() {
    search = queryString;
    var search_URI = `q=${search}&`,
        dataAPI = dataURI + part_URI + maxResults_URI + order_URI + search_URI + type_URI;

    if (analyze) {
        $('iframe').remove();
        let div = $('<div>');
        div.attr('id', 'player');
        div.prependTo('.playlist');
    } else {
        analyze = true;
    }
    console.log(search);
    setTimeout(makeAjaxCall(dataAPI), 3000);
}

function makeAjaxCall(url) {
    $.ajax({
        url: url,
        beforeSend: function () {
            if (search === '') {
                console.log('no search');
                return false;
            }
        }
    }).then(function (response) {
        let num = randomize();
        playlist = response.items[num].id.playlistId;
        console.log(response);
        console.log(num);
        loadiFrame();
    });
}

/******************************************************************************/
/**************************** YOUTUBE IFRAME API  *****************************/
/******************************************************************************/

function loadiFrame() {
    // api loads through the script tag
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api/?origin='http://kennethpostigo.me'";
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



/******************************************************************************\
 *                                                                            *
 *                             WEBCAM API STUFF                               *
 *                                                                            *
\******************************************************************************/


'use strict';

$("#takeAnother").hide();
$("#analyze").hide();
/*GET VIDEO ON PAGE*/
//streaming only video
const mediaStreamConstraints = {
    video: true,
};

//video element where stream is placed
const localVideo = document.querySelector('video');

//local stream reproduced on the video
let localStream;

//data variable for the image taken by the camera
var data;

//adds mediaStream to the video
function gotLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    localVideo.srcObject = mediaStream;
}

//handles error by console logging error message
function handleLocalMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

//initialize media stream
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
/*-----------------------------------------*/
/*CAPTURE IMAGE*/
var video = document.getElementById('camera');

function grabWebCamVideo() {
    console.log("Getting user video...");
    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then(gotStream)
        .catch(function (e) {
            alert("getUserMedia() error: " + e.name);
        });
}

//on snap button click, create an image
$("#snap").on("click", function () {
    var photo = document.getElementById("photo");
    var photoContext = photo.getContext("2d");
    photoContext.drawImage(video, 0, 0, photo.width, photo.height);
    $("#camera").hide();
    $("#photo").show();
    $("#takeAnother").show();
    $("#analyze").show();
    $("#snap").hide();
});


$("#takeAnother").on("click", function () {
    $("#camera").show();
    $("#photo").hide();
    $("#snap").show();
    $("#takeAnother").hide();
    $("#analyze").show();
});

$("#analyze").on("click", function () {
    var canvas = document.getElementById("photo");
    data = canvas.toDataURL('image/png');
    processImage(data);
    console.log('analyze clicked with: ' + queryString);
    window.setTimeout(loadYouTube, 2000);
    console.log('loading Youtube');

    $("#snap").show();
    $("#takeAnother").hide();
    $("#analyze").hide();
    $("#camera").show();
    $("#photo").hide();
})


function renderPhoto(data) {
    var canvas = document.createElement('canvas');
    canvas.width = photoContextW;
    canvas.height = photoContextH;
    canvas.classList.add('incomingPhoto');
    // trail is the element holding the incoming images
    trail.insertBefore(canvas, trail.firstChild);

    var context = canvas.getContext('2d');
    var img = context.createImageData(photoContextW, photoContextH);
    img.data.set(data);
    context.putImageData(img, 0, 0);
}



/******************************************************************************\
 *                                                                            *
 *                          EMOTION API STUFF                                 *
 *                                                                            *
\******************************************************************************/


function processImage(imageURL) {

    var key1 = "6afd15ab009b4fe4ac99050056e2ec27";
    var key2 = "6ae8da5ab77f4d76a9a8c9570f428b9d";
    var endpoint = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    var subscriptionKey = key1;

    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "emotion"
    };

    var happyArray = ["pop music", "edm", "happy music"];
    var sadArray = ["rainy jazz", "emo", "blues"];
    var angryArray = ["metal", "test2", "test3"];
    var neutralArray = ["test1", "test2", "test3"];

    // var paramString = $.param(params);

    fetch(imageURL)
        .then(res => res.blob())
        .then(blobData => {
            $.post({
                url: endpoint + "?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion",
                contentType: "application/octet-stream",
                headers: {
                    'Ocp-Apim-Subscription-Key': key1
                },
                processData: false,
                data: blobData
            })
                .done(function (data) {
                    var emotions = data[0].faceAttributes.emotion;
                    var emotions2 = {
                        happy: emotions.happiness,
                        sad: emotions.sadness,
                        neutral: emotions.neutral,
                        anger: emotions.anger
                    };
                    var random = Math.floor(Math.random() * 3);
                    var highestEmotion = Object.keys(emotions2).reduce((a, b) => emotions2[a] > emotions2[b] ? a : b);
                    console.log(highestEmotion);
                    if (highestEmotion === "happy") {
                        queryString = happyArray[random];
                    }
                    else if (highestEmotion === "sad") {
                        queryString = sadArray[random];
                    }
                    else if (highestEmotion === "anger") {
                        queryString = angryArray[random];
                    }
                    else {
                        queryString = neutralArray[random];
                    }
                })
                .fail(function (err) {
                    console.log(JSON.stringify(err));
                });
        });
    console.log(queryString);
}