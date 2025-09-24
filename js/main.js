// ----------------- Imports des modules -----------------
import { Clock } from './clock.js';
import { Chrono } from './chrono.js';
import { Timer } from './timer.js';
import { Sidebar } from './sidebar.js';
import { toggleFullScreen } from './helpers.js';

// ----------------- Clock Buttons -----------------
document.getElementById('SecondsButton').addEventListener('click', () => Clock.displaySeconds());
document.getElementById('ToggleButton').addEventListener('click', () => Clock.toggleType());

// ----------------- Chrono Buttons -----------------
document.getElementById('FreezeButton').addEventListener('click', () => Chrono.freezeScreen());
document.getElementById('StartStopButton').addEventListener('click', () => Chrono.startStop());
document.getElementById('ResetButton').addEventListener('click', () => Chrono.reset());

// ----------------- Timer Buttons -----------------

// ----------------- Sidebar Buttons -----------------
document.getElementById('clock-button').addEventListener('click', () => Sidebar.selectMode('clock'));
document.getElementById('chrono-button').addEventListener('click', () => Sidebar.selectMode('chrono'));
document.getElementById('building-button').addEventListener('click', () => Sidebar.selectMode('building'));
document.getElementById('credits-button').addEventListener('click', () => Sidebar.selectMode('credits'));
document.getElementById('sidebar-toggle').addEventListener('click', () => Sidebar.toggle());

// ----------------- Fullscreen -----------------
document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullScreen);

// ----------------- Global Listeners -----------------
document.addEventListener("fullscreenchange", () => {
    const fullScreenButton = document.getElementById("fullscreen-toggle");
    if (document.fullscreenElement) {
        fullScreenButton.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
        fullScreenButton.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("keydown", (e) => {
    if (
        (e.ctrlKey && e.key.toLowerCase() === "u") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        (e.key === "F12") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j")
    ) {
        e.preventDefault();
        Sidebar.selectMode("problem");
    }
});

// ----------------- Loader -----------------
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.classList.remove("show");
        loader.classList.add("hide");
    }, 1000);
});

// ----------------- Sidebar Init -----------------
window.addEventListener("DOMContentLoaded", () => {
    Clock.init();
    Chrono.init();
    Timer.init();
    Sidebar.init();
    const params = new URLSearchParams(window.location.search);
    let path = params.get("path");

    let mode;
    if (path) {
        // Cas redirection depuis 404.html
        mode = path.replace("/", "") || "clock";
        history.replaceState({ mode }, "", path);
    } else {
        // Sinon, on récupère le dernier mode stocké ou défaut
        mode = localStorage.getItem("lastMode") || "clock";
        history.replaceState({ mode }, "", `/${mode}`);
    }

    Sidebar.selectMode(mode, true);
});

