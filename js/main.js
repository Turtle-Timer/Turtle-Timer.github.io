// ----------------- Imports des modules -----------------
import { Clock } from './clock.js';
import { Chrono } from './chrono.js';
import { Timer } from './timer.js';
import { Sidebar } from './sidebar.js';
import { toggleFullScreen } from './helpers.js';
import { notFound } from './notfound.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

var soundVolume = localStorage.getItem("sound") || 1;
const clickSound = new Audio('../sounds/button_click.mp3');
const trashSound = new Audio('../sounds/trash_chrono.mp3');
const starStopSound = new Audio('../sounds/start_stop_chrono.mp3');

const supabaseUrl = "https://xqvemmmwqukzkokkmmok.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdmVtbW13cXVremtva2ttbW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjY2NDgsImV4cCI6MjA3NTE0MjY0OH0.o5dstJ6Zvq0j0bHyClGHH5xCWbFRZK6TYdU6AMKPcVw"
const supabase = createClient(supabaseUrl, supabaseKey)

// ----------------- Clock Buttons -----------------
document.getElementById('SecondsButton').addEventListener('click', () => {Clock.displaySeconds(); clickSound.volume = soundVolume; clickSound.play();});
document.getElementById('ToggleButton').addEventListener('click', () => {Clock.toggleType(); clickSound.volume = soundVolume; clickSound.play();});

// ----------------- Chrono Buttons -----------------
document.getElementById('ClearHighlightsButton').addEventListener('click', () => {Chrono.clearAll(); trashSound.volume = soundVolume; trashSound.play();});
document.getElementById('HighlightsButton').addEventListener('click', () => {Chrono.saveTime(); starStopSound.volume = soundVolume; starStopSound.play();});
document.getElementById('FreezeButton').addEventListener('click', () => {Chrono.freezeScreen(); clickSound.volume = soundVolume; clickSound.play();});
document.getElementById('StartStopButton').addEventListener('click', () => {Chrono.startStop(); starStopSound.volume = soundVolume; starStopSound.play();});
document.getElementById('ResetButton').addEventListener('click', () => {Chrono.reset(); trashSound.volume = soundVolume; trashSound.play();});

// ----------------- Timer Buttons -----------------

// ----------------- Sidebar Buttons -----------------
document.getElementById('clock-button').addEventListener('click', () => Sidebar.selectMode('clock'));
document.getElementById('chrono-button').addEventListener('click', () => Sidebar.selectMode('chrono'));
document.getElementById('building-button').addEventListener('click', () => Sidebar.selectMode('building'));
document.getElementById('credits-button').addEventListener('click', () => Sidebar.selectMode('credits'));
// document.getElementById('timer-button').addEventListener('click', () => Sidebar.selectMode('timer'));
document.getElementById('sidebar-toggle').addEventListener('click', () => Sidebar.toggle());
document.getElementById('stats-button').addEventListener('click', () => Sidebar.selectMode('stats'));

// ----------------- Fullscreen -----------------
document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullScreen);

// ----------------- Background -----------------
document.getElementById('background-toggle').addEventListener('click', toggleBackground);

// ----------------- Sound -----------------
document.getElementById('sound-toggle').addEventListener('click', toggleSound);

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

document.addEventListener("keydown", (e) => {
    const modes = ["clock", "chrono", "building", "credits"];
    if (e.key === "Escape") Sidebar.toggle();
    if (e.key === "Tab") Sidebar.selectMode(modes[(modes.indexOf(localStorage.getItem("lastMode")) + 1) % modes.length]);
});

// ----------------- Loader -----------------
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const background = localStorage.getItem("background");
    if (background === "true") toggleBackground();

    const sound = localStorage.getItem("sound");
    if (sound === "0") toggleSound();

    setTimeout(() => {
        loader.classList.remove("show");
        loader.classList.add("hide");
    }, 1000);
    logConnection()
    setTimeout(() => {getTotalConnections();}, 1000);
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

function toggleBackground() {
    const backgroundButton = document.getElementById("background-toggle");
    const body = document.body;
    backgroundButton.disabled = true;

    body.classList.toggle("black");
    body.classList.toggle("white");

    backgroundButton.innerHTML = body.classList.contains("black") ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem("background", body.classList.contains("black"));

    setTimeout(() => {
        backgroundButton.disabled = false;
    }, 1000);
}

function toggleSound() {
    const soundButton = document.getElementById("sound-toggle");
    soundButton.disabled = true;

    soundVolume = soundVolume === 0 ? 1 : 0;
    soundButton.innerHTML = soundVolume === 0 ? '<i class="fa-solid fa-volume-mute"></i>' : '<i class="fa-solid fa-volume-up"></i>';
    localStorage.setItem("sound", soundVolume);

    setTimeout(() => {
        soundButton.disabled = false;
    }, 1000);
}

async function getTotalConnections() {
    const { count } = await supabase
        .from("connections")
        .select("id", { count: "exact" }); 
    document.getElementById("credits-nb-connections").innerText = `Nombre de connexions : ${count}`
}

async function logConnection() {
    await supabase
        .from("connections")
        .insert([{ timestamp: new Date().toISOString() }]);
}

supabase
    .channel('connexions-realtime')
    .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'connections' },
        () => {
            getTotalConnections()
        }
    )
    .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'connections' },
        () => {
            getTotalConnections()
        }
    )
    .subscribe();
