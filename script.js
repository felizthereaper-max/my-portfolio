const video = document.getElementById("luffyVideo");

/*
    CHANGE THESE TWO NUMBERS
    to choose the part of the Luffy video you want.
*/

const START_TIME = 5;
const END_TIME = 15;

video.addEventListener("loadedmetadata", () => {
    video.currentTime = START_TIME;

    video.play().catch(() => {
        console.log("Video autoplay waiting for browser permission.");
    });
});

video.addEventListener("timeupdate", () => {

    if (video.currentTime >= END_TIME) {
        video.currentTime = START_TIME;
        video.play();
    }

});
