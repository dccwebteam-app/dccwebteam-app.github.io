$(document).ready(function () {

    // play button animate
    $("svg.playVideo").on("click", function () {
        // pause all video
        $("video").each(function (i, v) {
            v.muted = true;
            v.pause();
        })

        $(this).addClass("goDown");
        var seeking = false;
        var svg_dom = $(this); // used latet

        if ($(svg_dom).hasClass("youTube")) {

        }
        else {
            // locate the video and assign requored attributes 
            var video = $(this).closest(".dnz-video-wrapper").find("video");
            var video_source = $(video).attr("dnz-video");

            // Rollback to default state once the video is completed
            video.on("ended, pause", function () {
                // Rollback to the original poster when the video ends
                video.attr("src", "");
                video.attr("controls", false);
                $(svg_dom).removeClass("goDown");
                $(svg_dom).parent().parent().removeClass("playing");
                video.removeClass("playing");
            });

              
            // play the video after the play animation ends
            video.attr("src", video_source);
            video.attr("controls", true);
            // avoid adding greyscale to playing video
            video.addClass("playing");
            $(svg_dom).parent().parent().addClass("playing");

            var video_player = $(video).get(0);
            video_player.muted = false;
            video_player.play();
        }


    });



})