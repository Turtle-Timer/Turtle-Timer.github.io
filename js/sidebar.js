import { setVisibility } from './helpers.js';

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const legalcredits = document.getElementById('legal-credits');

export const Sidebar = (() => {

    function toggle() {
        sidebar.classList.toggle("open");
        toggleBtn.style.left = sidebar.classList.contains("open")
            ? `calc(${sidebar.offsetWidth}px + ${toggleBtn.offsetWidth / 2}px)`
            : "1.5vw";
    }

    function selectMode(mode, skipHistory = false) {
        if (sidebar.classList.contains("open")) toggle();
        document.querySelectorAll('.mode').forEach(m => setVisibility(m,false));
        let el = document.getElementById("mode-" + mode);
        if (el === null) {
            mode = "notfound";
            el = document.getElementById("mode-notfound");
        }
        setVisibility(el, true);
        localStorage.setItem("lastMode", mode);
        setVisibility(legalcredits, mode === "credits");

        if (!skipHistory) {
            history.pushState({ mode }, "", `/${mode}`);
        }

        document.title = "Turtle Timer - " + mode.toUpperCase() + " 🐢";
    }
    
    function init() {
        const lastMode = localStorage.getItem("lastMode") || "clock";
        selectMode(lastMode, true);

        document.title = "Turtle Timer - " + lastMode.toUpperCase() + " 🐢";

        window.addEventListener("resize", () => {
            if (sidebar.classList.contains("open")) toggle();
        });

        window.addEventListener("load", () => {
            const loader = document.getElementById("loader");
            setTimeout(() => setVisibility(loader, false), 1000);
        });

        window.addEventListener("popstate", (event) => {
            const previousMode = event.state?.mode || "clock";
            localStorage.setItem("lastMode", previousMode);
            selectMode(previousMode, true);
            document.title = "Turtle Timer - " + previousMode.toUpperCase() + " 🐢";
        });
    }

    return { toggle, selectMode, init };
})();
