
const app = document.getElementById("app");

/* =========================
   CREATE BUTTON
========================= */

function createButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
}

/* =========================
   GLOBAL STATE
========================= */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* =========================
   SESSION
========================= */

const session = {

    identity: "",
    preference: "",
    luck: "",
    music: "",

    startedAt: Date.now()

};

/* =========================
   CARD FADE IN
========================= */

function animateCardIn() {

    const card = document.querySelector(".card");

    if (!card) return;

    card.classList.add("fade-in");

    requestAnimationFrame(() => {

        card.classList.add("show");

    });

}

/* =========================
   START APP
========================= */

async function startApp() {
    await showBoot();
    await showIdentity();
}

/* =========================
   BOOT
========================= */

async function typeLine(element, text) {

    const line = document.createElement("div");
    element.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        line.innerHTML = `> ${text.substring(0, i + 1)}<span class="cursor">▌</span>`;
        await sleep(35);
    }

    line.innerHTML = `> ${text}`;
    await sleep(300);
}

async function showBoot() {

    app.innerHTML = `
        <section class="boot-screen">
            <div class="boot-text" id="bootText"></div>
        </section>
    `;

    const bootText = document.getElementById("bootText");

    for (const line of bootSequence) {
        await typeLine(bootText, line);
    }

    await sleep(800);

    document.querySelector(".boot-screen").classList.add("hide");

    await sleep(500);
}

/* =========================
   IDENTITY
========================= */

async function showIdentity() {

    let locked = false;

    app.innerHTML = `
        <section class="card">
            <h1>${identityPage.title}</h1>
            <p>${identityPage.subtitle}</p>

            <div class="loading-text">
                <h2>${identityPage.question}</h2>
            </div>

            <div id="options"></div>
            <div id="response"></div>
        </section>
    `;

    const options = document.getElementById("options");
    const response = document.getElementById("response");

    identityPage.options.forEach(option => {

    const btn = createButton(option.text, () => {

        if (locked) return;

        // گزینه Someone else
        if (option.id === "other") {

            option.attempts = (option.attempts || 0) + 1;

            if (option.attempts === 1) {

                response.textContent = "Hmm...\n\nThis doesn't seem right.";
                return;

            }

            if (option.attempts === 2) {

                response.textContent = "Still trying? 🙂";
                return;

            }

            // بار سوم
            response.innerHTML = `
                Fine...<br><br>
                Curiosity deserves a reward.
            `;

            locked = true;

            options.style.opacity = "0.4";
            options.style.pointerEvents = "none";

            setTimeout(() => {
                startPreferenceFlow();
            }, 1600);

            return;
        }

        // دو گزینه اصلی
        locked = true;

        options.style.opacity = "0.4";
        options.style.pointerEvents = "none";

        session.identity = option.text;

        response.textContent = option.response;

        setTimeout(() => {
            startPreferenceFlow();
        }, 1200);

    });

    options.appendChild(btn);

});

    animateCardIn();
}

/* =========================
   TRANSITION → PREFERENCE
========================= */

async function startPreferenceFlow() {

    const card = document.querySelector(".card");

    card.style.transition = "opacity 0.6s ease";
    card.style.opacity = "0";

    await sleep(500);

    showPreference();
}

/* =========================
   PREFERENCE
========================= */

function showPreference() {

    app.innerHTML = `
        <section class="card">
            <h1>Preference Check</h1>
            <p>Choose what feels right. (Pick 2)</p>

            <div id="options"></div>
            <div id="response"></div>
        </section>
    `;

    const options = document.getElementById("options");
    const response = document.getElementById("response");

    let selected = [];
    let locked = false;

    const choices = [
        { id: "cafe", text: "☕ A cozy café" },
        { id: "walk", text: "🚶 A walk" },
        { id: "quiet", text: "🌿 Somewhere quiet" },
        { id: "new", text: "🎨 Something new" }
    ];

    const responses = {
        "cafe+walk": `Simple.<br>Relaxed.<br>I like that.`,
        "cafe+quiet": `That sounds like<br>a peaceful afternoon.`,
        "cafe+new": `Comfort<br>with curiosity.`,
        "quiet+walk": `Calm.<br>Fresh air.<br>Hard To Argue With That`,
        "new+walk": `Looks Like<br>You enjoy exploring.`,
        "new+quiet": `Peaceful...<br>But Still A Little adventurous.`
    };

    function getKey(arr) {
        return [...arr].sort().join("+");
    }

    function toggleChoice(id, btn) {

        if (locked) return;

        const index = selected.indexOf(id);

        if (index > -1) {
            selected.splice(index, 1);
            btn.style.background = "#334155";
        } else {
            if (selected.length >= 2) return;

            selected.push(id);
            btn.style.background = "#3B82F6";
        }

        updateResponse();
    }

    function updateResponse() {

        if (selected.length < 2) {
            response.textContent = "Pick at least two...";
            return;
        }

        const key = getKey(selected);
        session.preference = key;
        const reply = responses[key];

        if (!reply) {
            response.innerHTML = "Something went slightly off... try again.";
            return;
        }

        response.innerHTML = reply;

        if (!locked) {

            locked = true;

            options.style.opacity = "0.4";
            options.style.pointerEvents = "none";

            setTimeout(() => {

                const finalSelection = selected.slice();
                startLuckFlow(finalSelection);

            }, 1000);
        }
    }

    choices.forEach(choice => {
        const btn = createButton(choice.text, () => toggleChoice(choice.id, btn));
        options.appendChild(btn);
    });

    animateCardIn();
}

/* =========================
   LUCK FLOW FIX (MISSING PART)
========================= */

async function startLuckFlow(selected) {

    const card = document.querySelector(".card");

    card.style.transition = "opacity 0.6s ease";
    card.style.opacity = "0";

    await sleep(500);

    showLuck(selected);
}

/* =========================
   LUCK
========================= */

function showLuck(selected) {

    app.innerHTML = `
        <section class="card">

            <p class="subtitle">
                There's been an ongoing debate...<br>
                Let's hear your opinion.
            </p>

            <h1>Luck Check</h1>
            <p>If luck had to describe you...</p>

            <div id="options"></div>
            <div id="response"></div>

        </section>
    `;

    const options = document.getElementById("options");
    const response = document.getElementById("response");

    let locked = false;

    async function typeSequence() {

        response.innerHTML = "Checking historical records...";
        await sleep(700);

        response.innerHTML += "<br><br>⏳";
        await sleep(800);

        response.innerHTML = `
            Checking historical records...<br><br>
            ⏳<br><br>
            Results remain scientifically inconclusive. 🍀
        `;
    }

    const choices = [
        {
            id: "lucky",
            text: "🍀 Pretty lucky",
            reply: "Confidence noted. 🍀"
        },
        {
            id: "middle",
            text: "🙂 Somewhere in the middle",
            reply: "Probably the safest answer."
        },
        {
            id: "disagree",
            text: "🙃 Luck and I don't always agree"
        }
    ];

    function goNext() {

        locked = true;

        options.style.opacity = "0.4";
        options.style.pointerEvents = "none";

        setTimeout(() => {
            startMusicFlow(selected);
        }, 1200);
    }

    choices.forEach(choice => {

        const btn = createButton(choice.text, async () => {

            if (locked) return;

            if (choice.id === "disagree") {

                session.luck = "disagree";

                locked = true;
                options.style.opacity = "0.4";
                options.style.pointerEvents = "none";

                await typeSequence();

                setTimeout(() => {
                    startMusicFlow(selected);
                }, 1800);

                return;
            }

            session.luck = choice.id;

            response.innerHTML = choice.reply;
            goNext();
        });

        options.appendChild(btn);
    });

    animateCardIn();
}

/* =========================
   MUSIC
========================= */

function showMusic(selected) {

    app.innerHTML = `
        <section class="card">

            <h1>Music Check</h1>
            <p>Who's picking the music?</p>

            <div id="options"></div>
            <div id="response"></div>

        </section>
    `;

    const options = document.getElementById("options");
    const response = document.getElementById("response");

    let locked = false;

    const choices = [

        {
            id: "me",
            text: "🎧 Me",
            reply: `
                Excellent decision.<br><br>

                Potential musical disaster<br>
                successfully avoided.<br><br>

                🎵 Risk level: Low
            `
        },

        {
            id: "you",
            text: "🎵 You",
            reply: `
                Bold choice.<br><br>

                Searching for songs<br>
                that won't scare us both...<br><br>

                🎵 Risk level: High
            `
        }

    ];

    async function goNext() {

        locked = true;

        options.style.opacity = "0.4";
        options.style.pointerEvents = "none";

        // ⏳ اول اجازه بده متن دیده بشه
        await sleep(2700);

        const card = document.querySelector(".card");

        if (card) {
            card.style.transition = "opacity 0.6s ease";
            card.style.opacity = "0";
        }

        await sleep(600);

        showEndScreen();
    }

    choices.forEach(choice => {

        const btn = createButton(choice.text, async () => {

            if (locked) return;

            session.music = choice.id;

            response.innerHTML = choice.reply;

            await goNext();

        });

        options.appendChild(btn);
    });

    animateCardIn();
}

/* =========================
   MUSIC FLOW
========================= */

async function startMusicFlow(selected) {

    const card = document.querySelector(".card");

    if (card) {
        card.style.transition = "opacity 0.6s ease";
        card.style.opacity = "0";

        await sleep(500);
    }

    showMusic(selected);

}

async function showEndScreen() {

    app.innerHTML = `
        <section class="card">
            <div id="endText"></div>
        </section>
    `;

    animateCardIn();

    const endText = document.getElementById("endText");

    await sleep(600);

    await typeEndLine(endText, "System Report Complete.");
    await sleep(800);

    await typeEndLine(endText, "No errors detected.");
    await sleep(800);

    await typeEndLine(endText, "Session saved.");

    await sleep(1500);

    await typeBlueLine(endText, "Thanks, Princess.");

    await sendSession();

}

async function typeEndLine(element, text) {
    const line = document.createElement("div");
    element.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        line.innerHTML = `> ${text.substring(0, i + 1)}<span class="cursor">▌</span>`;
        await sleep(40);
    }

    line.textContent = `> ${text}`;
}

async function typeBlueLine(element, text) {
    const line = document.createElement("div");
    line.className = "end-thanks";
    element.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        line.innerHTML = `${text.substring(0, i + 1)}<span class="cursor">▌</span>`;
        await sleep(45);
    }

    line.textContent = text;
}

/* =========================
   SEND TO FORMSPREE
========================= */

async function sendSession() {

    const duration = Math.round(
        (Date.now() - session.startedAt) / 1000
    );

    const data = {

        sessionId: crypto.randomUUID(),

        identity: session.identity,
        preference: session.preference,
        luck: session.luck,
        music: session.music,

        duration: duration,

        startedAt: new Date(session.startedAt).toISOString(),

        device: navigator.platform,
        browser: navigator.userAgent

    };

    console.log("Sending:", data);

    try {

        const response = await fetch("https://formspree.io/f/xeebvgwj", {

            method: "POST",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        console.log("Status:", response.status);

        const result = await response.text();

        console.log(result);

    } catch (err) {

        console.error(err);

    }

}

/* =========================
   START
========================= */

startApp();