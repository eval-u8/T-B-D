var testDivEl = document.getElementById("player");
var searchResultsEl = document.getElementById("search-results-container");
var submitButtonEl = document.getElementById("submit-button");
var returnButtonEl = document.getElementById("return-button");
var lyricsResultEl = document.getElementById("#lyrics-result");
var artistSearch = document.querySelector("#artist-search").value;
var songSearch = document.querySelector("#song-search").value;
var searchTerm = artistSearch + " " + songSearch;
var youtubeApiKey = "AIzaSyCJWvqCTRTWGZS0kkTzWsyhnD-gB4nmWVE"

// // Function to get search term from input
$("#submit-button").on("click", function() {
    var artistSearch = document.querySelector("#artist-search").value;
    var songSearch = document.querySelector("#song-search").value;
    var searchTerm = artistSearch + " " + songSearch;
    var youtubeList = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + searchTerm + "&key=" + youtubeApiKey;

    fetch(youtubeList)
        .then(function(response) {
            return response.json();
        })

        .then(function(response) {
                    
            for (i=0; i < response.items.length; i++) {
                var title = response.items[i].snippet.title;
                var resultsEl = document.querySelector("#results-container");
                var resultsButton = document.createElement("button");
                resultsButton.id = title;
                resultsButton.textContent = title;
                resultsEl.appendChild(resultsButton);
            } 
        })
    
})



// Function to display video based on search
function displayVideo(songName, searchTerm) {


    var nameToSearch = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + searchTerm + "&key=" + youtubeApiKey;
=======
=======
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15


//Function to display video based on search
function displayVideo(songName) {

    /*var splitName = songName.split(' ');

    var searchTerm = "";

    for(var i = 0; i < splitName.length; i++) {
        searchTerm += splitName[i] + "&";
    }*/

    console.log(searchTerm);

    var nameToSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchTerm + "apikey=AIzaSyDZ1smQzCupYTg94dIrznPA46HLnyTdtrA";
<<<<<<< HEAD
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15
=======
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15

    fetch(nameToSearch)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
        console.log(response.items[0].id.videoId);
        onYouTubeIframeAPIReady(response.items[0].id.videoId);


        //Double check these work -- API rate limited and cannot test
        var titleEl = document.createElement("div");
        var descriptionEl = document.createElement("div");

        titleEl.textContent = response.items[0].snippet.title;
        descriptionEl.textContent = response.items[0].snippet.description;
    })  
    .catch(function(error) {
        console.log(error);
    })

}

//Additional functions for the YoutubeAPI to work as intended
function onYouTubeIframeAPIReady(songId) {
    if(songId !== undefined) {
        var player;
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: songId,
          playerVars: {
            'playsinline': 1
          },
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
    }
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    var done = false;
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}


//Functions for CSS modifications
function returnToSearch() {
    searchResultsEl.style.visibility = "hidden";
}

function displaySearchResults() {
    searchResultsEl.style.visibility = "visible";
}

function getLyrics(songName){

    var splitName = songName.split(' ');

    var searchTerm = "";

    for(var i = 0; i < splitName.length; i++) {
        searchTerm += splitName[i] + "&";
    }

    var apiKey = "https://api.musixmatch.com/ws/1.1/track.search?q="+ searchTerm + "page_size=3&page=1&s_track_rating=desc&apikey=b821d7d8d4a306e5ec045464dcd5ed20";
<<<<<<< HEAD
<<<<<<< HEAD
=======
    console.log(apiKey);
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15
=======
    console.log(apiKey);
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15

    fetch(apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        console.log(response);
        console.log(response.message.body.track_list[0].track.commontrack_id);

        var songId = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id="+ response.message.body.track_list[0].track.track_id + 
                        "&apikey=b821d7d8d4a306e5ec045464dcd5ed20";
        
        return fetch(songId);
    })
    .then(function(songIdResponse) {
        return songIdResponse.json();
    })
    .then(function(songIdResponse) {
        console.log(songIdResponse);

        var lyrics = songIdResponse.message.body.lyrics.lyrics_body;
        console.log(lyrics);

        //Get lyrics above to post to page. Getting error message right now.

    })
    .catch(function(error) {
        console.log(error);
    })


}

//Do not use function unless necessary
<<<<<<< HEAD
<<<<<<< HEAD
// displayVideo();
=======
//displayVideo("what");
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15
=======
//displayVideo("what");
>>>>>>> 84fad37c8af53993ec057feb9eb6918067997e15
submitButtonEl.addEventListener("click", displaySearchResults);
returnButtonEl.addEventListener("click", returnToSearch);

//disabled function to save API key from running out
//getLyrics("bohemian rhapsody queen");