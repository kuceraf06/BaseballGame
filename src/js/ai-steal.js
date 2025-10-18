let aiStealEnabled = true;
let canStealThisPitch = false;
let isNewPitch = false;

function aiSteal(force = false) {
    if (!aiStealEnabled) return;
    if (!canStealThisPitch && !force) return;
    if (gameState !== 'defense') return;
    if (runnersInMotion) return;

    canStealThisPitch = false;
    isNewPitch = false;

    const rand = Math.random() * 100;

    if (bases[0] && bases[1] && !bases[2] && rand < 100) {
        stealAttempt2B = true;
        stealAttempt3B = true;
        stealBtn2B.classList.add('active-steal');
        stealBtn3B.classList.add('active-steal');
        startDoubleSteal(() => {
            stealAttempt2B = false;
            stealAttempt3B = false;
            stealBtn2B.classList.remove('active-steal');
            stealBtn3B.classList.remove('active-steal');
        });
        canStealThisPitch = false; // po stealu se čeká na nový nadhoz
        return;
    }

    // 1B → 2B
    if (bases[0] && !bases[1] && rand < 100)  {
        stealAttempt2B = true;
        stealBtn2B.classList.add('active-steal');
        startSteal1B2B(() => {
            stealAttempt2B = false;
            stealBtn2B.classList.remove('active-steal');
        });
        canStealThisPitch = false;
    }

    // 2B → 3B
    if (bases[1] && !bases[2] && rand < 100)  {
        stealAttempt3B = true;
        stealBtn3B.classList.add('active-steal');
        startSteal2B3B(() => {
            stealAttempt3B = false;
            stealBtn3B.classList.remove('active-steal');
        });
        canStealThisPitch = false;
    }
}

// Při startu nadhozu povolíme steal
const origStartPitch = startPitch;
startPitch = function () {
    origStartPitch();
    canStealThisPitch = true; // nový nadhoz → AI může krást
    setTimeout(() => {
        aiSteal();
    }, 50);
};

throwButton.addEventListener('click', () => {
    setTimeout(() => {
        aiSteal(true);
    }, 50);
});

window.aiSteal = aiSteal;
