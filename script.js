/* =========================================================
   REZIN AI — ULTRA JAVASCRIPT ENGINE
========================================================= */

"use strict";

/* =========================================================
   HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   DOM
========================================================= */

const body = document.body;

const sidebar = $("#sidebar");
const mobileMenu = $("#mobileMenu");

const topbar = $("#topbar");

const cursorGlow = $(".cursor-glow");
const cursorDot = $(".cursor-dot");

const toast = $("#toast");
const toastTitle = $("#toastTitle");
const toastText = $("#toastText");

const commandOverlay = $("#commandOverlay");
const commandInput = $("#commandInput");
const commandButton = $("#commandButton");
const searchButton = $("#searchButton");
const closeCommand = $("#closeCommand");

const aiStage = $("#aiStage");

const scrollProgress = $("#scrollProgress");

const clock = $("#clock");

const terminalBody = $("#terminalBody");


/* =========================================================
   TOAST SYSTEM
========================================================= */

let toastTimer;

function showToast(
    title = "Rezin AI",
    message = "System ready."
) {

    toastTitle.textContent = title;
    toastText.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);

}


/* =========================================================
   BOT / AI OPEN
========================================================= */

function openRezinAI(prompt = "") {

    /*
        Botpress is loaded externally.

        If the Botpress API is available,
        attempt to open it.

        Otherwise the UI still works and
        displays a status message.
    */

    try {

        if (
            window.botpress &&
            typeof window.botpress.open === "function"
        ) {

            window.botpress.open();

            showToast(
                "REZIN AI",
                prompt
                    ? `Ready for: ${prompt}`
                    : "AI assistant opened."
            );

            return;
        }

    } catch (error) {

        console.warn(
            "Botpress open API unavailable.",
            error
        );

    }

    showToast(
        "REZIN AI",
        prompt
            ? `AI ready — ${prompt}`
            : "AI assistant connection ready."
    );

}


/* =========================================================
   HERO BUTTONS
========================================================= */

const openAIButton = $("#openAI");
const labAIButton = $("#labAI");
const finalAIButton = $("#finalAI");

openAIButton?.addEventListener(
    "click",
    () => openRezinAI()
);

labAIButton?.addEventListener(
    "click",
    () => openRezinAI()
);

finalAIButton?.addEventListener(
    "click",
    () => openRezinAI()
);


/* =========================================================
   PROMPT CHIPS
========================================================= */

$$("[data-prompt]").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const prompt =
                button.dataset.prompt;

            openRezinAI(prompt);

        }
    );

});


/* =========================================================
   EXPLORE BUTTON
========================================================= */

$("#exploreButton")?.addEventListener(
    "click",
    () => {

        $("#capabilities")?.scrollIntoView({
            behavior: "smooth"
        });

    }
);


/* =========================================================
   SIDEBAR
========================================================= */

mobileMenu?.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle("open");

        mobileMenu.classList.toggle("open");

    }
);


/* =========================================================
   NAVIGATION
========================================================= */

const menuButtons =
    $$(".menu-button");

const targetMap = {

    home:
        "#home",

    capabilities:
        "#capabilities",

    learning:
        "#capabilities",

    creative:
        "#capabilities",

    problem:
        "#capabilities",

    explore:
        "#explore"

};

menuButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            menuButtons.forEach(
                item =>
                    item.classList.remove("active")
            );

            button.classList.add("active");

            const target =
                button.dataset.target;

            if (
                target === "home"
            ) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            } else {

                const element =
                    $(targetMap[target]);

                element?.scrollIntoView({
                    behavior: "smooth"
                });

            }

            if (
                window.innerWidth <= 760
            ) {

                sidebar.classList.remove(
                    "open"
                );

            }

            const names = {

                home:
                    "AI Chat",

                capabilities:
                    "Coding",

                learning:
                    "Learning",

                creative:
                    "Creative",

                problem:
                    "Problem Solving",

                explore:
                    "Explore AI"

            };

            showToast(
                names[target] || "Rezin AI",
                "Module selected."
            );

        }
    );

});


/* =========================================================
   ACTIVE SECTION DETECTION
========================================================= */

const sectionTargets = [
    {
        id: "home",
        button: 0
    },
    {
        id: "capabilities",
        button: 1
    },
    {
        id: "explore",
        button: 5
    }
];

const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    const match =
                        sectionTargets.find(
                            item =>
                                item.id ===
                                entry.target.id
                        );

                    if (!match) return;

                    menuButtons.forEach(
                        button =>
                            button.classList.remove(
                                "active"
                            )
                    );

                    menuButtons[
                        match.button
                    ]?.classList.add(
                        "active"
                    );

                }

            });

        },
        {
            threshold: .35
        }
    );

sectionTargets.forEach(item => {

    const element =
        document.getElementById(item.id);

    if (element) {

        sectionObserver.observe(
            element
        );

    }

});


/* =========================================================
   SCROLL EFFECTS
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        const scrollTop =
            window.scrollY;

        const height =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        const percentage =
            height > 0
                ? (scrollTop / height) * 100
                : 0;

        scrollProgress.style.width =
            `${percentage}%`;

        if (
            scrollTop > 40
        ) {

            topbar.classList.add(
                "scrolled"
            );

        } else {

            topbar.classList.remove(
                "scrolled"
            );

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();

    clock.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour12: false
            }
        );

}

updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   CURSOR
========================================================= */

let pointerX = 0;
let pointerY = 0;

let glowX = 0;
let glowY = 0;

document.addEventListener(
    "pointermove",
    event => {

        pointerX =
            event.clientX;

        pointerY =
            event.clientY;

        cursorDot.style.left =
            `${pointerX}px`;

        cursorDot.style.top =
            `${pointerY}px`;

    }
);

function animateCursor() {

    glowX +=
        (pointerX - glowX) *
        .09;

    glowY +=
        (pointerY - glowY) *
        .09;

    cursorGlow.style.left =
        `${glowX}px`;

    cursorGlow.style.top =
        `${glowY}px`;

    requestAnimationFrame(
        animateCursor
    );

}

if (
    window.matchMedia(
        "(pointer:fine)"
    ).matches
) {

    animateCursor();

}


/* =========================================================
   3D HERO CORE
========================================================= */

if (aiStage) {

    document.addEventListener(
        "pointermove",
        event => {

            if (
                window.innerWidth < 900
            ) return;

            const x =
                event.clientX /
                window.innerWidth -
                .5;

            const y =
                event.clientY /
                window.innerHeight -
                .5;

            aiStage.style.transform =
                `
                rotateX(${-y * 8}deg)
                rotateY(${x * 10}deg)
                translateZ(0)
                `;

        }
    );

}


/* =========================================================
   3D TILT CARDS
========================================================= */

const tiltCards =
    $$(".tilt");

tiltCards.forEach(card => {

    card.addEventListener(
        "pointermove",
        event => {

            if (
                window.innerWidth < 900
            ) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) /
                    centerY) *
                -4;

            const rotateY =
                ((x - centerX) /
                    centerX) *
                4;

            card.style.transform =
                `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-7px)
                `;
        }
    );

    card.addEventListener(
        "pointerleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* =========================================================
   CAPABILITY LAUNCH
========================================================= */

$$(".capability").forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const mode =
                    card.dataset.mode;

                const prompts = {

                    chat:
                        "Let's talk.",

                    coding:
                        "Help me code.",

                    learning:
                        "Teach me something.",

                    creative:
                        "Help me create something.",

                    problem:
                        "Help me solve a problem.",

                    explore:
                        "Show me what AI can do."

                };

                openRezinAI(
                    prompts[mode]
                );

            }
        );

    }
);


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    $$(".reveal");

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                (entry, index) => {

                    if (
                        entry.isIntersecting
                    ) {

                        setTimeout(
                            () => {

                                entry.target
                                    .classList
                                    .add(
                                        "visible"
                                    );

                            },
                            index * 65
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: .12
        }
    );

revealElements.forEach(
    element =>
        revealObserver.observe(
            element
        )
);


/* =========================================================
   COMMAND PALETTE
========================================================= */

function openCommandPalette() {

    commandOverlay.classList.add(
        "open"
    );

    setTimeout(
        () => {

            commandInput.focus();

        },
        100
    );

}

function closeCommandPalette() {

    commandOverlay.classList.remove(
        "open"
    );

    commandInput.value = "";

}

commandButton?.addEventListener(
    "click",
    openCommandPalette
);

searchButton?.addEventListener(
    "click",
    openCommandPalette
);

closeCommand?.addEventListener(
    "click",
    closeCommandPalette
);

commandOverlay?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            commandOverlay
        ) {

            closeCommandPalette();

        }

    }
);


/* =========================================================
   COMMAND ACTIONS
========================================================= */

const commandButtons =
    $$("#commandList button");

commandButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const command =
                    button.dataset.command;

                closeCommandPalette();

                if (
                    command === "chat"
                ) {

                    openRezinAI();

                }

                if (
                    command === "capabilities"
                ) {

                    $("#capabilities")
                        ?.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }

                if (
                    command === "lab"
                ) {

                    $("#explore")
                        ?.scrollIntoView({
                            behavior:
                                "smooth"
                        });

                }

                if (
                    command === "top"
                ) {

                    window.scrollTo({
                        top: 0,
                        behavior:
                            "smooth"
                    });

                }

            }
        );

    }
);


/* =========================================================
   COMMAND SEARCH
========================================================= */

commandInput?.addEventListener(
    "input",
    () => {

        const query =
            commandInput.value
                .toLowerCase()
                .trim();

        commandButtons.forEach(
            button => {

                const text =
                    button.textContent
                        .toLowerCase();

                button.style.display =
                    text.includes(query)
                        ? "flex"
                        : "none";

            }
        );

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        const tag =
            document.activeElement?.tagName;

        const typing =
            tag === "INPUT" ||
            tag === "TEXTAREA";

        /*
           CTRL + K
        */

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            if (
                commandOverlay.classList.contains(
                    "open"
                )
            ) {

                closeCommandPalette();

            } else {

                openCommandPalette();

            }

            return;

        }

        /*
           ESC
        */

        if (
            event.key === "Escape"
        ) {

            closeCommandPalette();

            sidebar.classList.remove(
                "open"
            );

            return;

        }

        /*
           /
        */

        if (
            event.key === "/" &&
            !typing
        ) {

            event.preventDefault();

            openRezinAI();

            return;

        }

        /*
           NUMBER SHORTCUTS
        */

        if (
            !typing &&
            /^[1-6]$/.test(event.key)
        ) {

            const index =
                Number(event.key) - 1;

            menuButtons[index]?.click();

        }

    }
);


/* =========================================================
   RIPPLE EFFECT
========================================================= */

$$(".btn, .quick-card, .menu-button")
    .forEach(element => {

        element.addEventListener(
            "click",
            event => {

                const ripple =
                    document.createElement(
                        "span"
                    );

                ripple.style.position =
                    "absolute";

                ripple.style.width =
                    "10px";

                ripple.style.height =
                    "10px";

                ripple.style.borderRadius =
                    "50%";

                ripple.style.background =
                    "rgba(255,255,255,.25)";

                ripple.style.pointerEvents =
                    "none";

                const rect =
                    element.getBoundingClientRect();

                ripple.style.left =
                    `${event.clientX - rect.left}px`;

                ripple.style.top =
                    `${event.clientY - rect.top}px`;

                ripple.style.transform =
                    "translate(-50%,-50%) scale(0)";

                ripple.style.transition =
                    "transform .6s ease, opacity .6s ease";

                element.appendChild(
                    ripple
                );

                requestAnimationFrame(
                    () => {

                        ripple.style.transform =
                            "translate(-50%,-50%) scale(18)";

                        ripple.style.opacity =
                            "0";

                    }
                );

                setTimeout(
                    () =>
                        ripple.remove(),
                    700
                );

            }
        );

    });


/* =========================================================
   PARTICLE STAR ENGINE
========================================================= */

const starCanvas =
    document.getElementById(
        "stars"
    );

const starCtx =
    starCanvas?.getContext(
        "2d"
    );

let stars = [];

function resizeStars() {

    if (!starCanvas) return;

    const ratio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    starCanvas.width =
        window.innerWidth *
        ratio;

    starCanvas.height =
        window.innerHeight *
        ratio;

    starCanvas.style.width =
        `${window.innerWidth}px`;

    starCanvas.style.height =
        `${window.innerHeight}px`;

    starCtx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    createStars();

}

function createStars() {

    stars = [];

    const amount =
        Math.min(
            300,
            Math.floor(
                window.innerWidth *
                window.innerHeight /
                6500
            )
        );

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        stars.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            size:
                Math.random() *
                1.5 +
                .15,

            speed:
                Math.random() *
                .18 +
                .025,

            alpha:
                Math.random() *
                .7 +
                .15,

            depth:
                Math.random()

        });

    }

}

function animateStars() {

    if (!starCtx) return;

    starCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    stars.forEach(
        star => {

            star.y -=
                star.speed;

            if (
                star.y < -5
            ) {

                star.y =
                    window.innerHeight +
                    5;

                star.x =
                    Math.random() *
                    window.innerWidth;

            }

            const px =
                pointerX *
                star.depth *
                .015;

            const py =
                pointerY *
                star.depth *
                .015;

            starCtx.beginPath();

            starCtx.arc(
                star.x + px,
                star.y + py,
                star.size,
                0,
                Math.PI * 2
            );

            starCtx.fillStyle =
                `rgba(
                    200,
                    195,
                    255,
                    ${star.alpha}
                )`;

            starCtx.fill();

        }
    );

    requestAnimationFrame(
        animateStars
    );

}

resizeStars();
animateStars();

window.addEventListener(
    "resize",
    resizeStars
);


/* =========================================================
   NETWORK PARTICLE ENGINE
========================================================= */

const networkCanvas =
    document.getElementById(
        "network"
    );

const networkCtx =
    networkCanvas?.getContext(
        "2d"
    );

let networkParticles = [];

function resizeNetwork() {

    if (!networkCanvas) return;

    networkCanvas.width =
        window.innerWidth;

    networkCanvas.height =
        window.innerHeight;

    createNetwork();

}

function createNetwork() {

    networkParticles = [];

    const count =
        window.innerWidth < 700
            ? 35
            : 65;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        networkParticles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            vx:
                (Math.random() - .5) *
                .15,

            vy:
                (Math.random() - .5) *
                .15,

            size:
                Math.random() *
                1.5 +
                .5

        });

    }

}

function animateNetwork() {

    if (!networkCtx) return;

    networkCtx.clearRect(
        0,
        0,
        networkCanvas.width,
        networkCanvas.height
    );

    networkParticles.forEach(
        particle => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            if (
                particle.x < 0 ||
                particle.x >
                    networkCanvas.width
            ) {

                particle.vx *= -1;

            }

            if (
                particle.y < 0 ||
                particle.y >
                    networkCanvas.height
            ) {

                particle.vy *= -1;

            }

            networkCtx.beginPath();

            networkCtx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            networkCtx.fillStyle =
                "rgba(125,110,255,.35)";

            networkCtx.fill();

        }
    );

    /*
       Connect nearby particles.
    */

    for (
        let i = 0;
        i < networkParticles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < networkParticles.length;
            j++
        ) {

            const a =
                networkParticles[i];

            const b =
                networkParticles[j];

            const dx =
                a.x - b.x;

            const dy =
                a.y - b.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance < 130
            ) {

                const opacity =
                    (1 -
                        distance / 130) *
                    .09;

                networkCtx.beginPath();

                networkCtx.moveTo(
                    a.x,
                    a.y
                );

                networkCtx.lineTo(
                    b.x,
                    b.y
                );

                networkCtx.strokeStyle =
                    `rgba(
                        125,
                        110,
                        255,
                        ${opacity}
                    )`;

                networkCtx.lineWidth =
                    .5;

                networkCtx.stroke();

            }

        }

    }

    requestAnimationFrame(
        animateNetwork
    );

}

resizeNetwork();
animateNetwork();

window.addEventListener(
    "resize",
    resizeNetwork
);


/* =========================================================
   TERMINAL ACTIVITY
========================================================= */

const terminalMessages = [

    "✓ Rezin Core interface loaded",

    "✓ Neural workspace ready",

    "✓ AI assistant connection available",

    "✓ Interactive 3D engine active",

    "✓ Command system initialized",

    "✓ User interface ready"

];

let terminalIndex = 0;

function addTerminalMessage() {

    if (!terminalBody) return;

    const line =
        document.createElement(
            "div"
        );

    line.className =
        "terminal-success";

    line.textContent =
        terminalMessages[
            terminalIndex %
            terminalMessages.length
        ];

    terminalBody.appendChild(
        line
    );

    terminalIndex++;

    /*
       Keep terminal clean.
    */

    const children =
        terminalBody.children;

    while (
        children.length > 8
    ) {

        children[1]?.remove();

    }

}

setInterval(
    addTerminalMessage,
    5000
);


/* =========================================================
   SYSTEM BUTTON
========================================================= */

$("#terminalButton")?.addEventListener(
    "click",
    () => {

        $("#system")?.scrollIntoView({
            behavior: "smooth"
        });

        showToast(
            "SYSTEM",
            "Rezin Core diagnostics opened."
        );

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                showToast(
                    "REZIN AI",
                    "Command center ready."
                );

            },
            700
        );

    }
);


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    "%c REZIN AI ",
    "color:#fff;background:#806cff;padding:8px 14px;border-radius:8px;font-weight:900;"
);

console.log(
    "%c Personal AI command center initialized.",
    "color:#9b91ff;"
);

console.log(
    "%c Shortcut: Ctrl + K = Command Palette",
    "color:#43ddff;"
);

console.log(
    "%c Shortcut: / = Open AI",
    "color:#43ddff;"
);
