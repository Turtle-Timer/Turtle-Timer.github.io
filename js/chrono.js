import { setVisibility, pad } from './helpers.js';

const $digital = document.getElementById('chrono-digital');
const $startStop = document.getElementById('StartStopButton');
const $reset = document.getElementById('ResetButton');
const $freeze = document.getElementById('FreezeButton');
const $mode = document.getElementById('mode-chrono');
const $highlights = document.getElementById('chrono-highlights');
const $highlightsButton = document.getElementById('HighlightsButton');

export const Chrono = (() => {
    let isrunning = false;
    let pending = false;
    let removePending;
    let freezed = false;
    let timeFreezed;
    let startTime;
    let elapsed;
    let intervalTitle;
    let highlights = [];

    function getTime(title=false, num_highlights=null) {
        elapsed = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const hh = Math.floor(totalSeconds / 3600);
        const mm = Math.floor((totalSeconds % 3600) / 60);
        const ss = totalSeconds % 60;
        let ms = elapsed % 1000;
        while (String(ms).length < 3) ms = "0" + String(ms);
        if (title) return `Turtle Timer - ${pad(hh)}:${pad(mm)}:${pad(ss)} 🐢`;
        if (num_highlights !== null) return `${num_highlights} - ${pad(hh)}:${pad(mm)}:${pad(ss)}<span class='ms-highlight'>${pad(ms)}</span>`;
        return `${pad(hh)}:${pad(mm)}:${pad(ss)}<span class='ms-chrono'>${pad(ms)}</span>`;
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
                $highlights.innerHTML = "";
                highlights = [];
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
        if (freezed) timeFreezed = `00:00:00<span class='ms-chrono'>000</span>`;
        else {
            $digital.innerHTML = `00:00:00<span class='ms-chrono'>000</span>`;
            timeFreezed = `00:00:00<span class='ms-chrono'>000</span>`;
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

    function saveTime() {
        let time;
        if (isrunning) {
            const highlight = document.createElement('div');
            highlight.className = 'highlight';
            highlight.innerHTML = getTime(false, highlights.length + 1);
            $highlights.prepend(highlight);
            $highlightsButton.innerHTML = "Temps enregistré";
            highlights.push(highlight);
            setTimeout(() => $highlightsButton.innerHTML = "Enregistrer le temps", 1000);
            $highlights.scrollTop = $highlights.scrollHeight;
            highlight.addEventListener('click', () => {
                if (highlight.innerHTML === "Supprimer?") {
                    setVisibility(highlight, false);
                    setTimeout(() => {$highlights.removeChild(highlight); $highlights.scrollTop = $highlights.scrollHeight;}, 1000);   
                } else {
                    time = highlight.innerHTML;
                    highlight.innerHTML = "Supprimer?";
                    setTimeout(() => highlight.innerHTML = time, 3000);
                }
            })
        } else {
            $highlightsButton.innerHTML = "Chrono non démarré";
            setTimeout(() => $highlightsButton.innerHTML = "Enregistrer le temps", 1000);
        }
    }

    function loop() {
        if ($mode.classList.contains("show") && isrunning && !freezed) update();
        requestAnimationFrame(loop);
    }

    function init() {
        $digital.style.fontSize = "9vw";
        $digital.innerHTML = "00:00:00<span class='ms-chrono'>000</span>";
        loop();
    }

    return { startStop, reset, freezeScreen, init, saveTime };
})();
