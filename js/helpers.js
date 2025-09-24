// ----------------- Helpers -----------------
export function setVisibility(el, show) {
    if (show) {
        el.classList.add("show");
        el.classList.remove("hide");
        el.style.display = "flex";
    } else {
        el.classList.add("hide");
        el.classList.remove("show");
        el.style.display = "none";
    }
}

export function pad(n){ 
    return n.toString().padStart(2,'0'); 
}

export function toggleFullScreen() {
    const fullScreenButton = document.getElementById("fullscreen-toggle");
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
