function processImage(imageURL) {

    var key1 = "92630115abaa463591463e52873eab1c";
    var key2 = "4db5f727fb034658ba425bd98cd9eb9f";
    var endpoint = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";

    var subscriptionKey = key1;

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the westcentralus region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase =
        endpoint + "/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "emotion"
    };

    var sourceImageUrl = imageURL;
    var formData = new FormData;
    formdata.append('image', $('#photo'));
    
    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: formData,
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        var emotions = data[0].faceAttributes.emotion;
        var highestEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
        console.log(JSON.stringify(data, null, 2));
        console.log(data[0].faceAttributes.emotion);
        var happiness = data[0].faceAttributes.emotion.happiness;
        var sadness = data[0].faceAttributes.emotion.sadness;
        console.log(happiness);
        console.log(sadness);
        console.log(Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b));

        return highestEmotion;
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ?
            "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ?
            "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};