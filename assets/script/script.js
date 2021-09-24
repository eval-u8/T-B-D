var testDivEl = document.getElementById("player");
var searchResultsEl = document.getElementById("search-results-container");
var submitButtonEl = document.getElementById("submit-button");
var returnButtonEl = document.getElementById("return-button");
var lyricsResultEl = document.getElementById("lyrics-result");
var pastSearchIdList = JSON.parse(localStorage.getItem("songIdList")) || [];
var pastSearchList = JSON.parse(localStorage.getItem("searchTerms")) || [];


var youtubeApiKey = config.ytApiErn;

// Function to get search term from input
$("#submit-button").on("click", function() {
    var artistSearch = document.querySelector("#artistField").value;
    var songSearch = document.querySelector("#songField").value;
    var searchTerm = artistSearch + " " + songSearch;
    var youtubeList = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=" + searchTerm  + "&key=" + youtubeApiKey;
    
    pastSearches(searchTerm.trim());
    //var resultsContainerEl = document.querySelector("#results-container");
    /*var clearThese = $("#search-results")[0];
    console.log(clearThese);

    //resultsContainerEl.innerHTML = "";
    console.log(clearThese.hasChildNodes());
    if(clearThese.hasChildNodes()) {
        removeAllChildNodes(clearThese);
    }*/
    
   // console.log($(resultsContainerEl));
    /*if($(resultsContainerEl)[0].children[0].attributes[0].textContent = "search-results") {
        console.log("this works");
        console.log($("#search-results"));
        //resultsContainerEl.removeChild($(resultsContainerEl)[0].children[0].children[0]);
    }*/
    
    fetch(youtubeList)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        //console.log("YT", response);
        if (artistSearch == "" || songSearch == "") {
            // replace alert with modal
            // https://www.w3schools.com/howto/howto_css_modals.asp

            alert("Please enter both an artist and a song title");
        }
        else {
            //var searchResultsTitle = document.createElement("h3");
            //var resultsEl = document.querySelector("#results-container");
            var resultsButtonEl = document.getElementById("search-results");
            //searchResultsTitle.innerHTML = "Search Results:";
            //resultsEl.appendChild(searchResultsTitle);

            for (var i=0; i < response.items.length; i++) {
                var title = (response.items[i].snippet.title);
                var videoId = response.items[i].id.videoId;
                var resultsButton = document.createElement("button");
                resultsButton.id = title;
                resultsButton.className = "resultsButton";
                // add css class
                // resultsButton.classList.add("");
                resultsButton.innerHTML = title;
                resultsButton.id = videoId;
                resultsButtonEl.appendChild(resultsButton);

                //Variable to display first 50 char of video description. Put under video?
                //var videoDescription = (response.items[i].snippet.description).substring(0,50);

                //Variable to display first 50 char of channel title. Put under video?
                //var channelTitle = (response.items[0].snippet.channelTitle).substring(0,50)
            }
        }
    })
    .catch(function(error) {
        console.log(error);
    })

    displaySearchResults();
})

//function to save search term to local storage
function pastSearches(searchTerm){
    
    var pastSearchEl = document.getElementById("past-searches-container");
    var pastSearchesArray = JSON.parse(localStorage.getItem("searchTerm")) || [];
    var artistSearch = document.querySelector("#artistField").value;
    var songSearch = document.querySelector("#songField").value;
    var searchObj = {
        artist: artistSearch, 
        title: songSearch
    }

    if(!(pastSearchesArray.some((e => e.artist === searchObj.artist) && (e => e.title === searchObj.title)))) {
        if((searchObj.artist !== "") && (searchObj.title !== "")) {
            pastSearchesArray.push(searchObj);
            localStorage.setItem("searchTerm", JSON.stringify(pastSearchesArray));
            var pastSearchLi = document.createElement("button");
            pastSearchLi.classList.add("past-button");
            pastSearchLi.setAttribute("id", artistSearch + "-" + songSearch);
            pastSearchLi.innerHTML = searchTerm;
            pastSearchEl.appendChild(pastSearchLi);
        }
    }
}

//function to click on past search and display results
$("#past-searches-container").on("click", "button", function() {
    var pastSearchesArray = JSON.parse(localStorage.getItem("searchTerm")) || [];
    var idArray = $(this).attr("id").split("-")
    var artistName = idArray[0];
    var titleName = idArray[1];
    
    for (var i=0; i < pastSearchesArray.length; i++) {

        if (artistName === pastSearchesArray[i].artist && titleName === pastSearchesArray[i].title) {
            document.querySelector("#artistField").value = artistName;
            document.querySelector("#songField").value =  titleName;
            document.querySelector("#submit-button").click();
        }
    }
    
    // var pastSearch = $(this).attr("id");
    // document.querySelector("#artistField").value = pastSearch;
    // document.querySelector("#submit-button").click();
});

//function to click result button to see youtube video and lyrics
$("#results-container").on("click", "button", function() {
    var videoId = $(this).attr("id");
    getLyrics();
    localStorage.setItem("songId", videoId);
})


//Additional functions for the YoutubeAPI to work as intended
$("#results-container").on("click", "button", function onYouTubeIframeAPIReady() {
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
});

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

//Function to get andm return lyrics from MusixMatch
function getLyrics(){
    var artistValue = document.querySelector("#artistField").value;
    var songValue = document.querySelector("#songField").value;

    var apiKey = "https://api.musixmatch.com/ws/1.1/track.search?q_artist="+ artistValue + "&q_track=" + songValue + "&page_size=3&page=1&s_track_rating=desc&apikey=b821d7d8d4a306e5ec045464dcd5ed20";


    fetch(apiKey)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        //console.log(response);

        var hasLyrics = response.message.body.track_list[0].track.has_lyrics;

        var songId = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id="+ response.message.body.track_list[0].track.track_id + 
                        "&apikey=b821d7d8d4a306e5ec045464dcd5ed20";

        if(hasLyrics === 1) {
            return fetch(songId);
        } else {
            var noLyricsParagraph = document.createElement("p");
            noLyricsParagraph.innerText = "We cannot find your lyrics :(";
            lyricsResultEl.appendChild(noLyricsParagraph);
        }
        
    })
    .then(function(songIdResponse) {
        return songIdResponse.json();
    })
    .then(function(songIdResponse) {
        
        var copyRightAllowed = songIdResponse.message.body.lyrics.lyrics_copyright;
        var lyrics = songIdResponse.message.body.lyrics.lyrics_body;
        var lyricParagraph = document.createElement("p");
        
        // var lyricsDiv = document.querySelector("#lyrics-result")
        
        // lyricsDiv.innerHTML = ""


        //If copyright law allows any of the lyrics to be reprinted, there are printed here
        //Songs with copyright issues do not print any lyrics but an error message instead
        if(copyRightAllowed == "Unfortunately we're not authorized to show these lyrics.") {
            //Print error message here
            lyricParagraph.innerText = "Copyright law does not allow these lyrics to be printed";
            lyricsResultEl.appendChild(lyricParagraph);
            console.log("Copyright law does not allow these lyrics to be printed :(");
        } else {
            //Print lyrics to page here
            console.log(lyrics);
            lyricParagraph.classList.add("lyrics-text");
            lyricParagraph.innerText = lyrics;
            lyricsResultEl.appendChild(lyricParagraph);
        }

    })
    .catch(function(error) {
        console.log(error);
        var errorParagraph = document.createElement("p");
        errorParagraph.innerText = "We cannot find your lyrics :(";
        lyricsResultEl.appendChild(errorParagraph);
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
        pastSearchLi.setAttribute("id", storedSearches[j].artist + "-" + storedSearches[j].title)
        pastSearchLi.innerHTML = storedSearches[j].artist + "-" + storedSearches[j].title;
        pastSearchEl.appendChild(pastSearchLi);
    }
}

//Do not use function unless necessary

submitButtonEl.addEventListener("click", displaySearchResults);

loadLocalStorage();

function reloadPage() {
    document.location.reload();
}

/*function removeAllChildNodes(container) {
    console.log(container);
    console.log(firstChild);
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
}*/

returnButtonEl.addEventListener("click", reloadPage);