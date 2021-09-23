var testDivEl = document.getElementById("player");
var searchResultsEl = document.getElementById("search-results-container");
var submitButtonEl = document.getElementById("submit-button");
var returnButtonEl = document.getElementById("return-button");
var lyricsResultEl = document.getElementById("#lyrics-result");
var pastSearchIdList = JSON.parse(localStorage.getItem("songIdList")) || [];
var pastSearchList = JSON.parse(localStorage.getItem("searchTerms")) || [];


var youtubeApiKey = "AIzaSyCcSCDSMxb3__k1A8c_W46zVB5_fLR9D1k";

// Function to get search term from input
$("#submit-button").on("click", function() {
    var artistSearch = document.querySelector("#artistField").value;
    var songSearch = document.querySelector("#songField").value;
    var searchTerm = artistSearch + " " + songSearch;
    console.log(searchTerm);
    var youtubeList = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=" + searchTerm  + "&key=" + youtubeApiKey;
    
    pastSearches(searchTerm.trim());

    fetch(youtubeList)
    .then(function(response) {
        return response.json();
    })

    .then(function(response) {
                
        for (var i=0; i < response.items.length; i++) {
            var title = response.items[i].snippet.title;
            var videoId = response.items[i].id.videoId;
            var resultsEl = document.querySelector("#results-container");
            var resultsButton = document.createElement("button");

            resultsButton.id = title;
            resultsButton.className = "resultsButton"
            // add css class
            // resultsButton.classList.add("");
            resultsButton.textContent = title;
            resultsButton.id = videoId;
            resultsEl.appendChild(resultsButton);
        }
    })
    .catch(function(error) {
        console.log(error);
    })

    
    
})

//function to save search term to local storage
function pastSearches(searchTerm){
    
    var pastSearchEl = document.querySelector("#past-searches-container");

    //pastSearchEl.innerHTML = "";

    var pastSearchesArray = JSON.parse(localStorage.getItem("searchTerm")) || [];

    if(!(pastSearchesArray.includes(searchTerm))) {
        console.log("before", pastSearchesArray);
        pastSearchesArray.push(searchTerm);
        console.log("after", pastSearchesArray);

        var pastSearchLi = document.createElement("button");
        pastSearchLi.classList.add("past-button");
        pastSearchLi.setAttribute("id", searchTerm);
        pastSearchLi.innerHTML = searchTerm;
        pastSearchEl.appendChild(pastSearchLi);
    }

    /*for(var i = 0; i < pastSearchesArray.length; i++) { 
        console.log(pastSearchesArray[i]);
        pastSearchesArray[i].trim();
        console.log(pastSearchesArray[i]);
    }*/

    localStorage.setItem("searchTerm", JSON.stringify(pastSearchesArray));

    var buttonArray = JSON.parse(localStorage.getItem("searchTerm")) || [];

}

//function to click on past search and display results
$("#past-searches-container").on("click", "button", function() {
    var pastSearch = $(this).attr("id");
    console.log(pastSearch);
    document.querySelector("#artistField").value = pastSearch;
    document.querySelector("#submit-button").click();
});

//function to click result button to see youtube video and lyrics
$("#results-container").on("click", "button", function() {
    var videoId = $(this).attr("id");
    var titleEl = document.createElement("div");
    var descriptionEl = document.createElement("div");

    console.log(videoId);

    localStorage.setItem("songId", videoId);
    onYouTubeIframeAPIReady();
})


//Additional functions for the YoutubeAPI to work as intended
function onYouTubeIframeAPIReady() {
    var songId = localStorage.getItem("songId");

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

function getLyrics(){
    var artistValue = document.querySelector("#artistField").value;
    var songValue = document.querySelector("#songField").value;


    var apiKey = "https://api.musixmatch.com/ws/1.1/track.search?q_artist="+ artistValue + "&q_track=" + songValue + "&page_size=3&page=1&s_track_rating=desc&apikey=b821d7d8d4a306e5ec045464dcd5ed20";

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

        var copyRightAllowed = songIdResponse.message.body.lyrics.lyrics_copyright;
        var lyrics = songIdResponse.message.body.lyrics.lyrics_body;
        var lyricParagraph = document.createElement("p");

        console.log($("#lyrics-div"));
        if($("#lyrics-div")) {
            lyricParagraph.textContent = "";
        }

        //If copyright law allows any of the lyrics to be reprinted, there are printed here
        //Songs with copyright issues do not print any lyrics but an error message instead
        if(copyRightAllowed == "Unfortunately we're not authorized to show these lyrics.") {
            //Print error message here
            lyricParagraph.innerText = "Copyright law does not allow these lyrics to be printed";
        } else {
            //Print lyrics to page here
            console.log(lyrics);
            if(lyricParagraph.innerText === "") {
                lyricParagraph.setAttribute("id", "lyrics-div");
                lyricParagraph.classList.add("lyrics-text");
                lyricParagraph.innerText = lyrics;
            } else {
                console.log("we are here");
                lyricParagraph.innerText = "";
                lyricParagraph.innerText = lyrics;
            }


            searchResultsEl.appendChild(lyricParagraph);
        }

    })
    .catch(function(error) {
        console.log(error);
    })


}

function clearSearchValues() {
    $("#artistField")[0].value = "";
    $("#songField")[0].value = "";
}

function loadLocalStorage(){
    var pastSearchEl = document.querySelector("#past-searches-container")

    var storedSearches = JSON.parse(localStorage.getItem("searchTerm")) || [];
    console.log(storedSearches);
    
    for (var j=0; j < storedSearches.length; j++) {
        var pastSearchLi = document.createElement("button");
        pastSearchLi.classList.add("past-button");
        pastSearchLi.setAttribute("id", storedSearches[j])
        pastSearchLi.innerHTML = storedSearches[j];
        pastSearchEl.appendChild(pastSearchLi);
    }
}
//Do not use function unless necessary

submitButtonEl.addEventListener("click", displaySearchResults);
submitButtonEl.addEventListener("click", clearSearchValues);
returnButtonEl.addEventListener("click", returnToSearch);

//disabled function to save API key from running out
submitButtonEl.addEventListener("click", getLyrics);

loadLocalStorage();