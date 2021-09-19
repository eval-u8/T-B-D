var testDivEl = document.getElementById("player");

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
        //src="http://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&origin=http://example.com"
        

       // var videoLink = "https://www.youtube.com/embed/" + response.items[0].id.videoId;

        //console.log(videoLink);

        /*var videoContainerEl = document.createElement("div");
        testDivEl.appendChild(videoContainerEl); */


        /*var videoEl = document.createElement("iframe");
        videoEl.setAttribute("src", videoLink);
        videoEl.setAttribute("width", 560);
        videoEl.setAttribute("height", 315);
        videoEl.setAttribute("frameborder", 0);
        videoEl.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        
        videoContainerEl.appendChild(player);*/
        console.log(response.items[0].id.videoId);
        onYouTubeIframeAPIReady(response.items[0].id.videoId);

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

displayVideo("what");

