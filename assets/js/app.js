/******************************************************************************\
 *                                                                            *
 *                          YOUTUBE API STUFF                                 *
 *                                                                            *
\******************************************************************************/

$(document).ready(function () {
    //$('#snap').hide();
    let numVids = parseInt(localStorage.videos);
    if (numVids > 0) {
        videos = numVids;
        pagestart = true;
        createTable();
    } else {
        $('.clearVids').hide();
    }
});

/*****************************  VARIABLES  ************************************/

function randomize() {
    return randomnumber = Math.floor(Math.random() * maxResults + 1);
}


/******************************************************************************/
/***************************** YOUTUBE DATA API  ******************************/
/******************************************************************************/

// restrict api key before publishing
var playlist,
    videos = 0,
    pagestart = false,
    search,
    analyze = false;

var dataAPI_key = 'AIzaSyC6IMRpjLTVrKcquFMtbqhSB-by1Lp1sNU',
    dataURI = `https://www.googleapis.com/youtube/v3/search?key=${dataAPI_key}&`,
    part = 'snippet',
    maxResults = 25,
    order = 'viewCount',
    type = 'video',
    num,
    renum;

var part_URI = `part=${part}&`,
    type_URI = `type=${type}`,
    maxResults_URI = `maxResults=${maxResults}&`,
    order_URI = `order=${order}&`;

var player,
    done = false; // video is not done

// search string
var queryString;


function loadYouTube() {
    if (queryString === "undefined") {
        return;
    }

    search = 'royalty free ' + queryString;
    var search_URI = `q=${search}&`,
        dataAPI = dataURI + part_URI + maxResults_URI + order_URI + search_URI + type_URI;

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
        if (pagestart === true) {
            num = renum;
            playlist = response.items[num].id.videoId;
            pagestart = false;
        } else {
            num = randomize();

            playlist = response.items[num].id.videoId;
            let title = response.items[num].snippet.title;
            localStorage.setItem(videos, title + '++' + playlist + '++' + num + '++' + queryString);
            videos++;
            localStorage.setItem('videos', videos);
            createTable();
        }

        if (analyze) {
            let source = 'https://www.youtube.com/embed/' + playlist + '?origin=https%3A%2F%2Fkennethpostigo.me&amp;enablejsapi=1&amp;widgetid=1';
            $('iframe').attr('src', source);
        } else {
            analyze = true;
            setTimeout(loadiFrame, 1000);
        }
    });
}

function createTable() {
    // create the table and add videos
    $('.clearVids').show();

    let tablediv = $('.table'),
        table = $('<table>'),
        hrow = $('<tr>'),
        head = $('<th>');

    tablediv.empty();
    table.attr('class', 'vidlist');
    head.text('Video History');
    hrow.append(head);
    table.append(hrow);
    tablediv.append(table);

    for (let i = 0; i < videos; i++) {
        let videoInfo = localStorage.getItem('' + i + '').split('++'),
            videoTitle = videoInfo[0],
            videoLink = 'https://www.youtube.com/embed/' + videoInfo[1] + '?origin=https%3A%2F%2Fkennethpostigo.me&amp;enablejsapi=1&amp;widgetid=1',
            newnum = videoInfo[2],
            newqueryString = videoInfo[3];

        let row = $('<tr>'),
            cell = $('<td>');

        cell.attr({
            class: i,
            'data-src': videoLink,
            'data-num': newnum,
            'data-query': newqueryString
        });
        cell.text(videoTitle);
        row.append(cell)
        $('.vidlist').append(row);
    }
}

function resetTable() {
    videos = 0;
    localStorage.clear();
    $('.table').empty();
}

$(document).on('click', '#clearVids', function () {
    resetTable();
    $('.clearVids').hide();
});

$(document).on('click', 'td', function () {
    if (pagestart === true) {
        queryString = $(this).attr('data-query');
        renum = $(this).attr('data-num');
        loadYouTube();
    }
    $('iframe').attr('src', $(this).attr('data-src'));
    $('iframe').show();
});

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
        videoId: playlist,
        playerVars: {
            origin: 'https://kennethpostigo.me',
            controls: 0,
            color: 'white',
            autoplay: 1,
            iv_load_policy: 3, // video annotations
            rel: 0, // related videos
            showinfo: 0
            // loop: 1

            // for playlists

            //listType: 'playlist',
            //list: playlist
        }
    });
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
    //$('#snap').show();
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
    $('iframe').show();

    pagestart = false;
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

    // API keys used for Face API call
    var key1 = "6afd15ab009b4fe4ac99050056e2ec27";
    var key2 = "6ae8da5ab77f4d76a9a8c9570f428b9d";
    var endpoint = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

    var happyArray = ["pop music", "edm music", "funk music"];
    var sadArray = ["sad jazz", "sad music", "blues music"];
    var angryArray = ["heavy metal", "hardcore punk music", "gangsta rap"];
    var neutralArray = ["70s rock", "classical music", "reggae music"];

    // converts the image taken by the camera into a BLOB (binary large object) and POSTs it to Microsoft Cognitive Services servers
    fetch(imageURL)
        .then(res => res.blob())
        .then(blobData => {
            $.post({

                // API call parameters
                url: endpoint + "?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion",
                contentType: "application/octet-stream",
                headers: {
                    'Ocp-Apim-Subscription-Key': key1
                },
                processData: false,
                data: blobData
            })
                .done(function (data) {
                    // if no emotional analysis is returned from the API call this will alert the user to take another picture
                    if (data.length < 1) {
                        $("#sentiment").removeClass("happy sad anger fail neutral");
                        $("#sentiment").text("We weren't able to register a face in that image. Please try again!").addClass("fail");
                        getGif("failure");
                    }
                    else {
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
                            $("#sentiment").removeClass("happy sad anger fail neutral");
                            queryString = happyArray[random];
                            $("#sentiment").text("Happy! :)").addClass("happy");
                            getGif("happy");
                        }
                        else if (highestEmotion === "sad") {
                            $("#sentiment").removeClass("happy sad anger fail neutral");
                            queryString = sadArray[random];
                            $("#sentiment").text("Sad :(").addClass("sad");
                            getGif("sad");
                        }
                        else if (highestEmotion === "anger") {
                            $("#sentiment").removeClass("happy sad anger fail neutral");
                            queryString = angryArray[random];
                            $("#sentiment").text("ANGRY!! >:(").addClass("anger");
                            getGif("angry");
                        }
                        else {
                            $("#sentiment").removeClass("happy sad anger fail neutral");
                            queryString = neutralArray[random];
                            $("#sentiment").text("You feel nothing.").addClass("neutral");
                            getGif("bored");
                        }
                    }
                })
                .fail(function (err) {
                    console.log(JSON.stringify(err));
                });
        });
    console.log(queryString);
};

function getGif(emotion) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        emotion + "&api_key=dc6zaTOxFJmzC&limit=1";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(queryURL);

            console.log(response);
            var results = response.data;

            var div = $("<div>");
            var gif = $("<img>");

            gif.attr("src", results[0].images.fixed_height.url);

            div.append(gif);

            $("#sentiment").prepend(div);
        })
};
