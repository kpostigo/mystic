'use strict';
/*GET VIDEO ON PAGE*/
//streaming only video
const mediaStreamConstraints = {
    video: true,
};

//video element where stream is placed
const localVideo = document.querySelector('video');

//local stream reproduced on the video
let localStream;

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
    .catch(function(e) {
        alert("getUserMedia() error: " + e.name);
    });
}

//on snap button click, create an image
$("#snap").on("click", function() {
        var photo = document.getElementById("photo");
        var photoContext = photo.getContext("2d");
        photoContext.drawImage(video, 0, 0, photo.width, photo.height);
    });

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


