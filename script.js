const introVideo = document.getElementById("introVideo");
const film = document.querySelector(".film");
const skipBtn = document.getElementById("skipBtn");

let didHideFilm = false;

// Try to autoplay video safely
async function tryPlayVideo() {
  try {
    introVideo.currentTime = 0;
    await introVideo.play();
  } catch (e) {
    // Autoplay might be blocked; it's okay.
  }
}

function hideFilm() {
  if (didHideFilm) return;
  didHideFilm = true;

  film.classList.add("hidden");
  // Stop consuming resources
  introVideo.pause();
}

// 1) Start video attempt on load
window.addEventListener("load", () => {
  tryPlayVideo();
});

// 2) Hide intro when user scrolls enough or clicks skip
let scrollRaf = false;
function onScroll() {
  if (scrollRaf) return;
  scrollRaf = true;

  requestAnimationFrame(() => {
    const y = window.scrollY || 0;

    // Adjust threshold if you want
    if (y > 120) hideFilm();

    scrollRaf = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

skipBtn.addEventListener("click", () => {
  hideFilm();
});

// ---------------------------
// Canvas particles / background
// ---------------------------
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w = 0, h = 0, dpr = 1;
function resize() {
  dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
  w = canvas.clientWidth = window.innerWidth;
  h = canvas.clientHeight = window.innerHeight;

  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const TAU = Math.PI * 2;

const config = {
  count: Math.floor(Math.min(140, Math.max(60, w / 10))),
  linkDist: 120,
  speed: 0.28,
};

const particles = [];
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < config.count; i++) {
    particles.push({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-1, 1) * config.speed,
      vy: rand(-1, 1) * config.speed,
      r: rand(1.1, 2.4),
      hue: Math.random() < 0.55 ? rand(250, 285) : rand(175, 195), // purple/teal
      a: rand(0.35, 0.9)
    });
  }
}
initParticles();

let last = performance.now();

function step(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  ctx.clearRect(0, 0, w, h);

  // soft vignette
  const g = ctx.createRadialGradient(w * 0.5, h * 0.2, 50, w * 0.5, h * 0.2, Math.max(w, h));
  g.addColorStop(0, "rgba(124,92,255,0.10)");
  g.addColorStop(0.45, "rgba(45,226,230,0.05)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Update particles
  for (const p of particles) {
    p.x += p.vx * (dt * 60);
    p.y += p.vy * (dt * 60);

    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;
  }

  // Draw links
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];

    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < config.linkDist) {
        const t = 1 - dist / config.linkDist;
        ctx.strokeStyle = `rgba(233,236,255,${0.10 * t})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, TAU);
    ctx.fill();

    // glow
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.a * 0.25})`;
    ctx.arc(p.x, p.y, p.r * 2.2, 0, TAU);
    ctx.fill();
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);

// Optional: re-init on big resize
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    config.count = Math.floor(Math.min(140, Math.max(60, window.innerWidth / 10)));
    initParticles();
  }, 150);
});
