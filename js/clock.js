import { setVisibility, pad } from './helpers.js';

const $hour = document.getElementById('hour');
const $minute = document.getElementById('minute');
const $second = document.getElementById('second');
const $digital = document.getElementById('clock-digital');
const $cadran = document.getElementById('clock-cadran');
const $horloge = document.getElementById('clock-horloge');
const $mode = document.getElementById('mode-clock');
const $point = document.getElementById('point');
const $toggleButton = document.getElementById('ToggleButton');
const $secondsButton = document.getElementById('SecondsButton');
const btnType = document.getElementById('ToggleButton');
const btnSec = document.getElementById('SecondsButton');

let showSeconds = false;

export const Clock = (() => {

    function toggleType() {
        const clockType = localStorage.getItem("clock-type") || "Numérique";
        $toggleButton.disabled = true;
        $toggleButton.innerHTML = "Cooldown <i class='fa-solid fa-spinner'></i>";

        if (clockType === "Analogique") {
            localStorage.setItem("clock-type", "Numérique");

            setVisibility($hour,false);
            setVisibility($minute,false);
            setVisibility($second,false);
            setVisibility($point,false);
            setTimeout(() => { setVisibility($cadran,true); setVisibility($horloge,false); }, 400);
            setTimeout(() => { setVisibility($digital,true); }, 1000);
        } else {
            localStorage.setItem("clock-type", "Analogique");

            setVisibility($digital,false);
            setTimeout(() => { setVisibility($cadran,false); setVisibility($horloge,true); }, 400);
            setTimeout(() => { setVisibility($hour,true); setVisibility($minute,true); setVisibility($second,true); setVisibility($point,true); }, 1000);
        }

        setTimeout(() => { $toggleButton.disabled = false, 2000; $toggleButton.innerHTML = localStorage.getItem("clock-type") === "Analogique" ? "Numérique <i class='fa-solid fa-tv'></i>" : "Analogique <i class='fa-solid fa-clock'></i>"}, 1000);
    }


    function displaySeconds() {
        $secondsButton.disabled = true;
        $secondsButton.innerHTML = "Cooldown <i class='fa-solid fa-spinner'></i>";

        if ($digital.classList.contains("show")) {
            setVisibility($digital, false);
            setTimeout(() => {
                setVisibility($digital,true); 
                showSeconds = !showSeconds;
                localStorage.setItem("display-seconds", showSeconds);
            }, 500);
        } else {
            showSeconds = !showSeconds;
            localStorage.setItem("display-seconds", showSeconds);
        }

        setTimeout(() => {$secondsButton.disabled = false; $secondsButton.innerHTML = !showSeconds ? "Afficher les secondes <i class='fa-regular fa-eye'></i>" : "Cacher les secondes <i class='fa-regular fa-eye-slash'></i>";}, 1000);
    }

    function update() {
        const now = new Date();
        const hh = now.getHours();
        const mm = now.getMinutes();
        const ss = now.getSeconds();
        const ms = now.getMilliseconds();

        if ($hour.classList.contains("show")) {
            const secAngle = (ss + ms/1000) * 6;
            const minAngle = (mm + ss/60 + ms/(60*1000)) * 6;
            const hourAngle = ((hh % 12) + mm/60 + ss/(60*60) + ms/(60*60*1000)) * 30;

            $second.style.transform = `translate(-50%,-100%) rotate(${secAngle}deg)`;
            $minute.style.transform = `translate(-50%,-100%) rotate(${minAngle}deg)`;
            $hour.style.transform   = `translate(-50%,-100%) rotate(${hourAngle}deg)`;
        }

        if (showSeconds) {
            if ($hour.classList.contains("show") && $second.classList.contains("hide")) setVisibility($second,true);
            $digital.style.fontSize = "10.5vw";
            $digital.innerHTML = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
            if ($digital.classList.contains("show") && $horloge.classList.contains("show")) setVisibility($digital,false);
        } else {
            if ($second.classList.contains("show")) setVisibility($second,false);
            $digital.style.fontSize = "17vw";
            $digital.innerHTML = `${pad(hh)}:${pad(mm)}`;
            if ($digital.classList.contains("show") && $horloge.classList.contains("show")) setVisibility($digital,false);
        }
    }

    function loop() { 
        if ($mode.classList.contains("show")) update();
        requestAnimationFrame(loop); 
    }

    function init() {
        const clockType = localStorage.getItem("clock-type") || "Numérique";
        const displaySecondsLocalVar = localStorage.getItem("display-seconds") || "false";

        if (displaySecondsLocalVar === "true") {
            btnSec.innerHTML = "Cacher les secondes <i class='fa-regular fa-eye-slash'></i>";
            showSeconds = true;
        }

        if (clockType === "Analogique") {
            btnType.innerHTML = "Numérique <i class='fa-solid fa-tv'></i>";
            setVisibility($horloge, true);
            setVisibility($hour, true);
            setVisibility($minute, true);
            setVisibility($point, true);
            if (showSeconds) setVisibility($second, true);
        } else {
            setVisibility($cadran, true);
            setVisibility($digital, true);
        }

        loop();
    }

    return { toggleType, displaySeconds, init };
})();
