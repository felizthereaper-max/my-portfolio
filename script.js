const video = document.getElementById("luffyVideo");

const START_TIME = 5;
const END_TIME = 15;

video.addEventListener("loadedmetadata", () => {

    video.currentTime = START_TIME;

    video.play().catch(() => {
        console.log("Autoplay blocked.");
    });

});

video.addEventListener("timeupdate", () => {

    if (video.currentTime >= END_TIME) {

        video.currentTime = START_TIME;

        video.play();

    }

});
