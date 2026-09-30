```javascript
const video = document.querySelector(".luffy-video");

// Try to start the video automatically
video.play().catch(() => {
    console.log("Autoplay was blocked by the browser.");
});

// Restart automatically if the video ends
video.addEventListener("ended", () => {
    video.currentTime = 0;
    video.play();
});
```
