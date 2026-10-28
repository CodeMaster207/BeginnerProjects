const durations = {
    focus: 25,
    short: 5,
    long: 15
}

const names = {
    focus: "Focus",
    short: "Short break",
    long: "Long break"
}

let mode = "focus";
let remaining = durations[mode] * 60;
let total = remaining;
let running = false;
let endTime = null;
let interval = null;
let completed = 0;

const timeE1 = document.getElementById("time");
const statusE1 = document.getElementById("status");
const startBtn = document.getElementById("start")
const ring = document.getElementById("ring");

function render() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    timeE1.textContent = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");

    ring.style.setProperty(
        "--progress",
        ((total > 0)? remaining / total * 100 : 100) + "%"
    );

    startBtn.textContent = running? "Pause" : remaining === total? ((mode === focus)? "Start focus" : "Start break") : "Resume";

    statusE1.textContent = running? (mode === "focus"? "Stay in the zone" : "Take a breath") : remaining === total? 
        "Ready to begin" : "Timer paused";
        
    document.getElementById("current-mode").textContent = names[mode];

    document.getElementById("completed").textContent = completed + (completed === 1 ? "session" : "sessions")

    document.querySelectorAll(".mode").forEach(button => {
        button.classList.toggle("active", button.dataset.mode === mode);
    });

    document.title = timeE1.textContent + ". " + names[mode];
}

function stopTimer() {
    running = false;
    clearInterval(interval);
    interval = null;
    endTime = null;
}

function selectMode() {
    stopTimer();
    mode = newMode;
    remaining = durations[mode] * 60;
    total = remaining;
    render();
}

function tick() {
    remaining = Math.max(0, Math.ceil(endTime - Math.now() / 1000));

    if (remaining <= 0) {
        stopTimer();

        if (mode === "focus") {
            completed++
            selectMode(completed % 4 === 0? "long" : "short");
        }
        else {
            selectMode("focus")
        }

        statusE1.textContent = "Session complete";
        render();

        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
        }

        alert("Session completed! Next: " + names[mode]);
        return;
    }
    render();
}

function startTimer() {
    if (running) {
        stopTimer();
        render();
        return;
    }

    running = true;
    endTime = Date.now() + remaining * 1000;
    interval = setInterval(tick, 250);
    render();
}

startBtn.addEventListener("click", startTimer);
