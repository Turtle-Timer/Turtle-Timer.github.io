export const notFound = (() => {
    const icon = document.querySelector('.icon.notfound');

    let pos = { x: 5, y: 5 };
    let rotation = 0;
    let vel = { 
        x: (Math.random() - 0.5) * 0.25, 
        y: (Math.random() - 0.5) * 0.25,
    };

    function moveLoupe() {
        pos.x += vel.x;
        pos.y += vel.y;

        if (pos.x < -20 || pos.x > 20) vel.x *= -1;
        if (pos.y < -10 || pos.y > 10) vel.y *= -1;

        icon.style.transform = `translate(${pos.x}vw, ${pos.y}vh)`;

        requestAnimationFrame(moveLoupe);
    }

    moveLoupe();
})();
