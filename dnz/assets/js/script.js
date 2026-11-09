
$(document).ready(function () {



    if ($(window).width() >= 1024) {
        var template = document.getElementById('desktopLayoutContent');
        var clonedContent = template.content.cloneNode(true);
        document.getElementById('desktopLayout').appendChild(clonedContent);
    }
    else {
 var template = document.getElementById('desktopLayoutContent');
        var clonedContent = template.content.cloneNode(true);
        document.getElementById('mobileLayout').appendChild(clonedContent);

    }
    // play button animate
    $("svg.playVideo").on("click", function () {

        // animate play button
        $(this).addClass("goDown");
        var svg_dom = $(this); // used latet

        // pause all video
        $("video").each(function (i, v) {
            v.muted = true;
            v.pause();

        })

        // locate the video and assign required attributes 
        var video = $(this).closest(".dnz-video-wrapper").find("video");
        var video_source = $(video).attr("dnz-video");

        // Rollback to default state once the video is completed
        video.on("ended", function () {

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


    });

});
