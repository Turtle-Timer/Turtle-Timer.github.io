import { setVisibility, pad } from './helpers.js';

const $digital = document.getElementById('chrono-digital');
const $startStop = document.getElementById('StartStopButton');
const $reset = document.getElementById('ResetButton');
const $freeze = document.getElementById('FreezeButton');
const $mode = document.getElementById('mode-chrono');

export const Chrono = (() => {
    let isrunning = false;
    let pending = false;
    let removePending;
    let freezed = false;
    let timeFreezed;
    let startTime;
    let elapsed;
    let intervalTitle;

    function getTime(title=false) {
        elapsed = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;
        let ms = elapsed % 1000;
        while (String(ms).length < 3) ms = "0" + String(ms);
        if (title) return `Turtle Timer - ${pad(hh)}:${pad(mm)}:${pad(ss)} 🐢`;
        return `${pad(hh)}:${pad(mm)}:${pad(ss)}<span class='ms'>${pad(ms)}</span>`;
    }

    function update() {
        $digital.innerHTML = getTime();
        timeFreezed = $digital.innerHTML;
    }

    function startStop() {
        if (isrunning) {
            $startStop.innerHTML = "Démarrer";
            isrunning = false;
            if (pending) removePending = Date.now();
            if (freezed) timeFreezed = getTime();
            document.title = getTime(true);
        } else {
            $startStop.innerHTML = "Arretter";
            isrunning = true;
            if (!pending) {
                startTime = Date.now();
                pending = true;
            } else startTime += Date.now() - removePending;
            document.title = getTime(true);
            clearInterval(intervalTitle);
            intervalTitle = setInterval(() => {
                if (isrunning) {
                    if ($mode.classList.contains("show")) {
                        document.title = getTime(true);
                    }
                }
            }, 250);
        }
    }

    function reset() {
        $startStop.innerHTML = "Démarrer";
        isrunning = false;
        pending = false;
        clearInterval(intervalTitle);
        if (freezed) timeFreezed = `00:00:00<span class='ms'>000</span>`;
        else {
            $digital.innerHTML = `00:00:00<span class='ms'>000</span>`;
            timeFreezed = `00:00:00<span class='ms'>000</span>`;
        }
        document.title = 'Turtle Timer - CHRONO 🐢';
    }

    function freezeScreen() {
        if (!freezed) {
            $freeze.innerHTML = "Rétablir l'écran";
            freezed = true;
        } else {
            $freeze.innerHTML = "Figer l'écran";
            freezed = false;
            if (timeFreezed) $digital.innerHTML = timeFreezed;
        }
    }

    function loop() {
        if ($mode.classList.contains("show") && isrunning && !freezed) update();
        requestAnimationFrame(loop);
    }

    function init() {
        $digital.style.fontSize = "11.5vw";
        $digital.innerHTML = "00:00:00<span class='ms'>000</span>";
        loop();
    }

    return { startStop, reset, freezeScreen, init };
})();
