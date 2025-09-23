import { setVisibility, pad } from './helpers.js';

const $digital = document.getElementById('timer-digital');
const $mode = document.getElementById('mode-timer');

export const Timer = (() => {

    function update() {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();
        const ss = now.getSeconds();
        $digital.style.fontSize = "12vw";
        $digital.innerHTML = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
    }

    function loop() { 
        if ($mode.classList.contains("show")) update();
        requestAnimationFrame(loop); 
    }

    function init() {
        loop();
    }

    return { init };
})();