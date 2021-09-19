var testDivEl = document.getElementById("player");
var searchResultsEl = document.getElementById("search-results-container");
var submitButtonEl = document.getElementById("submit-button");
var returnButtonEl = document.getElementById("return-button");

function displayVideo(songName) {

    var splitName = songName.split(' ');

    var searchTerm = "";

    for(var i = 0; i < splitName.length; i++) {
        searchTerm += splitName[i] + "&";
    }

    console.log(searchTerm);

    var nameToSearch = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchTerm + "key=AIzaSyDZ1smQzCupYTg94dIrznPA46HLnyTdtrA";

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

function returnToSearch() {
    searchResultsEl.style.visibility = "hidden";
}

function displaySearchResults() {
    searchResultsEl.style.visibility = "visible";
}

//displaySearchResults();

//Do not use function unless necessary
//displayVideo("what");
submitButtonEl.addEventListener("click", displaySearchResults);
returnButtonEl.addEventListener("click", returnToSearch);

