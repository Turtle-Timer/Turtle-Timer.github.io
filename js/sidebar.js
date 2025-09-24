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

    function selectMode(mode) {
        if (sidebar.classList.contains("open")) toggle();
        document.querySelectorAll('.mode').forEach(m => setVisibility(m,false));
        const el = document.getElementById("mode-" + mode);
        setVisibility(el, true);
        if (mode !== "problem") localStorage.setItem("lastMode", mode);
        setVisibility(legalcredits, mode === "credits");
        history.pushState({ mode }, "", `/${mode}`);
    }

    function init() {
        const lastMode = localStorage.getItem("lastMode") || "clock";
        selectMode(lastMode);

        window.addEventListener("resize", () => {
            if (sidebar.classList.contains("open")) toggle();
        });

        window.addEventListener("load", () => {
            const loader = document.getElementById("loader");
            setTimeout(() => setVisibility(loader, false), 1000);
        });

        window.addEventListener("popstate", (event) => {
            const previousMode = event.state?.mode || "clock";
            selectMode(previousMode);
        });
    }

    return { toggle, selectMode, init };
})();
