/* =========================================================
   ENTRANCE VIDEO
========================================================= */

const entranceScreen =
    document.getElementById("entranceScreen");

const entranceVideo =
    document.getElementById("entranceVideo");

const siteContent =
    document.getElementById("siteContent");

let entranceFinished = false;


/* =========================================================
   FINISH ENTRANCE
========================================================= */

function finishEntrance() {

    if (entranceFinished) return;

    entranceFinished = true;


    /* Show website */

    if (siteContent) {
        siteContent.classList.add("show");
    }


    /* Fade out video */

    if (entranceScreen) {
        entranceScreen.classList.add("hide");
    }


    /* Remove video after fade */

    setTimeout(() => {

        if (entranceScreen) {
            entranceScreen.remove();
        }

        document.body.classList.remove(
            "intro-active"
        );

    }, 1400);

}


/* =========================================================
   WHEN VIDEO FINISHES
========================================================= */

entranceVideo.addEventListener(
    "ended",
    finishEntrance
);


/* =========================================================
   VIDEO ERROR
========================================================= */

entranceVideo.addEventListener(
    "error",
    () => {

        console.error(
            "Entrance video failed to load."
        );

        /* Prevent the website from getting stuck */

        setTimeout(
            finishEntrance,
            1000
        );

    }
);


/* =========================================================
   START VIDEO
========================================================= */

window.addEventListener(
    "load",
    async () => {

        try {

            entranceVideo.muted = true;

            entranceVideo.setAttribute(
                "muted",
                ""
            );

            entranceVideo.setAttribute(
                "playsinline",
                ""
            );

            await entranceVideo.play();

        } catch (error) {

            console.log(
                "Entrance video autoplay error:",
                error
            );

        }


        /* If video somehow already finished */

        if (entranceVideo.ended) {
            finishEntrance();
        }

    }
);
