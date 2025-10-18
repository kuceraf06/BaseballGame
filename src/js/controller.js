let clickedStop = false;
let clickedSwing = false;
let canSwingEffect = true;
let hoverStop = false;
let hoverSwing = false;
let clickedBase = null;

const controllerBases = [];
let controllerInitialized = false;

let hasThrownDuringSteal = false;

function initController(canvas) {
    const size = 60;
    const spacing = size * 1.1;
    const centerX = canvas.width - 150;
    const centerY = canvas.height - 100;

    controllerBases.length = 0;
    controllerBases.push(
        { label: "2B", x: centerX, y: centerY - spacing },
        { label: "1B", x: centerX + spacing, y: centerY },
        { label: "3B", x: centerX - spacing, y: centerY }
    );

    // 🧠 Přidáme click listener jen jednou
    if (!controllerInitialized) {
        canvas.addEventListener('click', handleControllerClick);
        canvas.addEventListener('mousemove', e => updateCursor(canvas, e));
        document.addEventListener('keydown', handleControllerKey); // 🧠 přidáno
        controllerInitialized = true;
    }
}

function handleControllerClick(e) {
    if (gameState !== 'defense') return;

    if (runnersInStealing && hasThrownDuringSteal) return;
    if (pickoffInProgress) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const size = 60;

    controllerBases.forEach(base => {
        const dx = Math.abs(mouseX - base.x);
        const dy = Math.abs(mouseY - base.y);

        if (dx + dy < size) {
            // 🧠 Házíme odkudkoliv, kde je míč, ale jen pokud hráč krade
            if (ball.owner && runnersInStealing) {  // <-- přidáno runnerStealing
                clickedBase = base.label;  
                hasThrownDuringSteal = true;
                throwBall(ball.owner, base.label);

                
                setTimeout(() => { clickedBase = null; }, 300);
            }
        }
    });

    handleStopClick(canvas, e);
    handleSwingClick(canvas, e);
}

function handleControllerKey(e) {
    if (gameState !== 'defense') return;
    if (pickoffInProgress) return;
    if (runnersInStealing && hasThrownDuringSteal) return;
    if (!ball.owner) return;

    let baseLabel = null;
    if (e.key === throwTo1BKey) baseLabel = '1B';
    else if (e.key === throwTo2BKey) baseLabel = '2B';
    else if (e.key === throwTo3BKey) baseLabel = '3B';
    if (!baseLabel) return;

    if (ball.owner && runnersInStealing) {
        hasThrownDuringSteal = true;
        throwBall(ball.owner, baseLabel);
    }
}

function drawController(ctx, canvas) {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "16px Arial";

    initController(canvas);

    const size = 60;

    // 🔸 vykreslení met
    controllerBases.forEach(base => {
        ctx.beginPath();
        ctx.moveTo(base.x, base.y - size);
        ctx.lineTo(base.x + size, base.y);
        ctx.lineTo(base.x, base.y + size);
        ctx.lineTo(base.x - size, base.y);
        ctx.closePath();

        if (clickedBase === base.label) {
            ctx.fillStyle = "rgba(255,215,0,0.8)";
        } else {
            ctx.fillStyle = "rgba(0,0,0,0.4)";
        }

        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fillText(base.label, base.x, base.y);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
    });

    if (gameState === 'defense') {
        // 🔸 STOP tlačítko
        const stopRadius = 60;
        const stopX = 175;
        const stopY = canvas.height - 125;

        ctx.beginPath();
        ctx.arc(stopX, stopY, stopRadius, 0, Math.PI * 2);
        ctx.fillStyle = clickedStop ? "rgba(255,215,0, 0.8)" : "rgba(0,0,0,0.4)";
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("STOP", stopX, stopY);
    }

    // 🔸 SWING tlačítko
    if (gameState === 'offense' || clickedSwing) {
        const swingRadius = 60;
        const swingX = 175;
        const swingY = canvas.height - 125;

        ctx.beginPath();
        ctx.arc(swingX, swingY, swingRadius, 0, Math.PI * 2);
        ctx.fillStyle = clickedSwing ? "rgba(255,215,0, 0.8)" : "rgba(0,0,0,0.4)";
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("SWING", swingX, swingY);
    }

    ctx.restore();
}

function handleStopClick(canvas, e) {
    if (gameState !== 'defense') return;
    if (!slider.active || slider.stopped) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const stopX = 175;
    const stopY = canvas.height - 125;
    const stopRadius = 60;

    const dx = mouseX - stopX;
    const dy = mouseY - stopY;

    if (dx * dx + dy * dy <= stopRadius * stopRadius) {
        clickedStop = true;
        triggerStopPitch();
        setTimeout(() => clickedStop = false, 300); 
    }
}

function handleSwingClick(canvas, e) {
    if (gameState !== 'offense' || !ball.active) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const swingX = 175;
    const swingY = canvas.height - 125;
    const swingRadius = 60;

    const dx = mouseX - swingX;
    const dy = mouseY - swingY;

    if (dx * dx + dy * dy <= swingRadius * swingRadius && canSwingEffect) {
        clickedSwing = true;
        canSwingEffect = false; // 🔹 zablokujeme efekt, dokud není nový nadhoz
        triggerSwing();

        setTimeout(() => {
            clickedSwing = false; // efekt zhasne
        }, 300);
    }
}

function updateCursor(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const stopX = 175;
    const stopY = canvas.height - 125;
    const stopRadius = 60;
    hoverStop = (gameState === 'defense' && (mouseX - stopX)**2 + (mouseY - stopY)**2 <= stopRadius**2);

    const swingX = 175;
    const swingY = canvas.height - 125;
    const swingRadius = 60;
    hoverSwing = (gameState === 'offense' && (mouseX - swingX)**2 + (mouseY - swingY)**2 <= swingRadius**2);

    let hoverBase = false;
    const baseSize = 60;
    controllerBases.forEach(base => {
        const dx = mouseX - base.x;
        const dy = mouseY - base.y;
        if (dx*dx + dy*dy <= baseSize*baseSize) {
            hoverBase = true;
        }
    });

    canvas.style.cursor = (hoverStop || hoverSwing || hoverBase) ? "pointer" : "default";
}

canvas.addEventListener('mousemove', e => updateCursor(canvas, e));
canvas.addEventListener('click', e => {
    handleStopClick(canvas, e);
    handleSwingClick(canvas, e);
});
