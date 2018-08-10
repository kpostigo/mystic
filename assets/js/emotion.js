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
    var querySelection = '';

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
                    console.log(JSON.stringify(data));
                    var emotions = data[0].faceAttributes.emotion;
                    var emotions2 = { "happy": emotions.happiness, "sad": emotions.sadness, "neutral": emotions.neutral, "anger": emotions.anger };
                    var random = Math.floor(Math.random() * 3);
                    var highestEmotion = Object.keys(emotions2).reduce((a, b) => emotions2[a] > emotions2[b] ? a : b);
                    console.log(highestEmotion);
                    if (highestEmotion === "happy") {
                        querySelection = happyArray[random];
                        $("#sentiment").text("Happy! :)").addClass("happy");
                        getGif("happy");
                    }
                    else if (highestEmotion === "sad") {
                        querySelection = sadArray[random];
                        $("#sentiment").text("Sad :(").addClass("sad");
                        getGif("sad");
                    }
                    else if (highestEmotion === "anger") {
                        querySelection = angryArray[random];
                        $("#sentiment").text("ANGRY!! >:(").addClass("anger");
                        getGif("angry");
                    }
                    else {
                        querySelection = neutralArray[random];
                        $("#sentiment").text("You feel nothing.").addClass("neutral");
                        getGif("bored");
                    }
                    console.log(querySelection);
                })
                .fail(function (err) {
                    console.log(JSON.stringify(err));
                });
        });
    return querySelection;
}

function getGif(emotion) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        emotion + "&api_key=dc6zaTOxFJmzC&limit=1";

      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
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
