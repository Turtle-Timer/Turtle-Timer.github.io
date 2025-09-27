import { setVisibility, pad } from './helpers.js';

const $digital = document.getElementById('chrono-digital');
const $startStopButton = document.getElementById('StartStopButton');
const $resetButton = document.getElementById('ResetButton');
const $freezeButton = document.getElementById('FreezeButton');
const $mode = document.getElementById('mode-chrono');
const $highlights = document.getElementById('chrono-highlights');
const $highlightsButton = document.getElementById('HighlightsButton');
const $clearHighlightsButton = document.getElementById('ClearHighlightsButton');

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
    let btnTimeout;

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
            $startStopButton.innerHTML = "Démarrer <i class='fa-solid fa-play'></i>";
            isrunning = false;
            if (pending) removePending = Date.now();
            if (freezed) timeFreezed = getTime();
            document.title = getTime(true);
        } else {
            $startStopButton.innerHTML = "Arrêter <i class='fa-solid fa-stop'></i>";
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
        $resetButton.innerHTML = "Réinitialisation <i class='fa-solid fa-spinner'></i>";
        $resetButton.disabled = true;
        $startStopButton.disabled = true;
        $startStopButton.innerHTML = "Réinitialisation <i class='fa-solid fa-spinner'></i>";
        isrunning = false;
        pending = false;
        clearInterval(intervalTitle);
        if (freezed) timeFreezed = `00:00:00<span class='ms-chrono'>000</span>`;
        else {
            $digital.innerHTML = `00:00:00<span class='ms-chrono'>000</span>`;
            timeFreezed = `00:00:00<span class='ms-chrono'>000</span>`;
        }
        if (highlights.length > 0) clearAll();
        document.title = 'Turtle Timer - CHRONO 🐢';

        setTimeout(() => {
            $resetButton.innerHTML = "Réinitialiser <i class='fa-solid fa-rotate-left'></i>";
            $resetButton.disabled = false;
            $startStopButton.disabled = false;
            $startStopButton.innerHTML = "Démarrer <i class='fa-solid fa-play'></i>";
        }, 1000);
    }

    function freezeScreen() {
        if (!freezed) {
            $freezeButton.innerHTML = "Rétablir l'écran <i class='fa-solid fa-arrow-rotate-left'></i>";
            freezed = true;
        } else {
            $freezeButton.innerHTML = "Figer l'écran <i class='fa-solid fa-snowflake'></i>";
            freezed = false;
            if (timeFreezed) $digital.innerHTML = timeFreezed;
        }
    }

    function saveTime() {
        let time;

        if (btnTimeout) clearTimeout(btnTimeout);

        if (isrunning) {
            const highlight = document.createElement('div');
            highlight.className = 'highlight';
            highlight.innerHTML = getTime(false, highlights.length + 1);
            highlight.dataset.delete = false;
            $highlights.prepend(highlight);
            $highlightsButton.innerHTML = "Temps enregistré <i class='fa-solid fa-check'></i>";
            highlights.push(highlight);
            btnTimeout = setTimeout(() => $highlightsButton.innerHTML = "Enregistrer le temps <i class='fa-solid fa-bookmark'></i>", 1000);
            $highlights.scrollTop = $highlights.scrollHeight;
            highlight.addEventListener('click', () => {
                if (highlight.dataset.delete === 'true') {
                    setVisibility(highlight, false);
                    setTimeout(() => {$highlights.removeChild(highlight); $highlights.scrollTop = $highlights.scrollHeight;}, 1000);   
                } else {
                    time = highlight.innerHTML;
                    highlight.innerHTML = "Supprimer <i class='fa-solid fa-trash-can'></i> ?";
                    highlight.dataset.delete = true;
                    setTimeout(() => highlight.innerHTML = time, 3000);
                }
            })
        } else {
            $highlightsButton.innerHTML = "Chrono non démarré <i class='fa-solid fa-triangle-exclamation'></i>";
            btnTimeout = setTimeout(() => $highlightsButton.innerHTML = "Enregistrer le temps <i class='fa-solid fa-bookmark'></i>", 1000);
        }
    }

    function clearAll() {
        if (highlights.length > 0) {
            if (btnTimeout) clearTimeout(btnTimeout);
            $clearHighlightsButton.disabled = true;
            $highlightsButton.disabled = true;
            $clearHighlightsButton.innerHTML = "Effacement <i class='fa-solid fa-spinner'></i>";
            $highlightsButton.innerHTML = "Effacement <i class='fa-solid fa-spinner'></i>";
            for (let i = 0; i < highlights.length; i++) {
                setVisibility(highlights[i], false);
            }
            setTimeout(() => {$highlights.innerHTML = ""; highlights = []; $clearHighlightsButton.disabled = false; $clearHighlightsButton.innerHTML = "Tout effacer <i class='fa-solid fa-trash-can'></i>"; }, 1000);
            btnTimeout = setTimeout(() => {$highlightsButton.disabled = false; $highlightsButton.innerHTML = "Enregistrer le temps <i class='fa-solid fa-bookmark'></i>";}, 1000);
        } else {
            $clearHighlightsButton.disabled = true;
            $clearHighlightsButton.innerHTML = "Liste vide <i class='fa-solid fa-triangle-exclamation'></i>";
            setTimeout(() => {$clearHighlightsButton.disabled = false; $clearHighlightsButton.innerHTML = "Tout effacer <i class='fa-solid fa-trash-can'></i>";}, 1000);
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

    return { startStop, reset, freezeScreen, init, saveTime, clearAll };
})();
