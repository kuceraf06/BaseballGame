let stealAttempt2B = false;
let stealAttempt3B = false;

const stealBtn2B = document.getElementById("stealButton2B");
const stealBtn3B = document.getElementById("stealButton3B");

function updateStealButtons() {
  if (runnersInMotion) return;

  if (gameState === "offense" && bases[0]) {
    stealBtn2B.style.display = "inline-block";
    stealBtn2B.style.left = POS.FIRST.x - 130 + "px";
    stealBtn2B.style.top = POS.FIRST.y - 60 + "px";

    if (bases[1] && !stealAttempt3B) {
      stealBtn2B.disabled = true;
      stealBtn2B.style.opacity = "0.5";
      stealBtn2B.style.cursor = "not-allowed";
      stealBtn2B.classList.remove("active-steal");
      stealAttempt2B = false;
    } else {
      stealBtn2B.disabled = false;
      stealBtn2B.style.opacity = "1";
      stealBtn2B.style.cursor = "pointer";
    }
  } else {
    stealBtn2B.style.display = "none";
    stealAttempt2B = false;
    stealBtn2B.classList.remove("active-steal");
  }

  if (gameState === "offense" && bases[1]) {
    stealBtn3B.style.display = "inline-block";
    stealBtn3B.style.left = POS.SECOND.x - 70 + "px";
    stealBtn3B.style.top = POS.SECOND.y + 100 + "px";

    if (bases[2]) {
      stealBtn3B.disabled = true;
      stealBtn3B.style.opacity = "0.5";
      stealBtn3B.style.cursor = "not-allowed";
      stealBtn3B.classList.remove("active-steal");
      stealAttempt3B = false;
    } else {
      stealBtn3B.disabled = false;
      stealBtn3B.style.opacity = "1";
      stealBtn3B.style.cursor = "pointer";
    }
  } else {
    stealBtn3B.style.display = "none";
    stealAttempt3B = false;
    stealBtn3B.classList.remove("active-steal");
  }
}

stealBtn2B.addEventListener("click", () => {
  if (stealBtn2B.disabled) return;
  stealAttempt2B = !stealAttempt2B;
  stealBtn2B.classList.toggle("active-steal", stealAttempt2B);
  updateStealButtons();
});

stealBtn3B.addEventListener("click", () => {
  if (stealBtn3B.disabled) return;
  stealAttempt3B = !stealAttempt3B;
  stealBtn3B.classList.toggle("active-steal", stealAttempt3B);
  updateStealButtons();
});

throwButton.addEventListener("click", () => {
  if (animationInProgress) return;
  throwButton.blur();

  const delayPitch = 400;
  let stealTriggered = false;

  if (stealAttempt2B && stealAttempt3B && bases[0] && bases[1] && !bases[2]) {
    stealTriggered = true;
    startDoubleSteal(() => {
      stealAttempt2B = false;
      stealAttempt3B = false;
      stealBtn2B.classList.remove("active-steal");
      stealBtn3B.classList.remove("active-steal");
      updateStealButtons();
    });
  }

  else if (stealAttempt2B && bases[0] && !bases[1]) {
    stealTriggered = true;
    startSteal1B2B(() => {
      stealAttempt2B = false;
      stealBtn2B.classList.remove("active-steal");
      updateStealButtons();
    });
  }

  else if (stealAttempt3B && bases[1] && !bases[2]) {
    stealTriggered = true;
    startSteal2B3B(() => {
      stealAttempt3B = false;
      stealBtn3B.classList.remove("active-steal");
      updateStealButtons();
    });
  }

  setTimeout(() => {
    if (typeof startPitch === "function") startPitch();
  }, stealTriggered ? delayPitch : 400 + Math.random() * 700);
});

function startSteal1B2B(onComplete) {
  window.isStealOnly = true;
  runnersInStealing = true;
  startAnimation();
  stealBtn2B.style.display = "none";
  stealBtn3B.style.display = "none";
  runnersInMotion = true;

  const runner = bases[0];
  if (!runner) return finishSteal(onComplete);

  const anim = [{ from: 0, to: 1, player: runner }];
  bases[1] = runner;
  bases[0] = null;

  runAnimations(anim, () => finishSteal(onComplete), true);
  drawRun();
}

function startSteal2B3B(onComplete) {
  window.isStealOnly = true;
  runnersInStealing = true;
  startAnimation();
  stealBtn2B.style.display = "none";
  stealBtn3B.style.display = "none";
  runnersInMotion = true;

  const runner = bases[1];
  if (!runner) return finishSteal(onComplete);

  const anim = [{ from: 1, to: 2, player: runner }];
  bases[2] = runner;
  bases[1] = null;

  const catcher = players.find(p => p.name === 'Catcher');
  catcher.targetX = catcher.homeX;
  catcher.targetY = catcher.homeY;
  catcher.moving = true;

  runAnimations(anim, () => finishSteal(onComplete), true);
}

function startDoubleSteal(onComplete) {
  window.isStealOnly = true;
  runnersInStealing = true;
  startAnimation();
  stealBtn2B.style.display = "none";
  stealBtn3B.style.display = "none";
  runnersInMotion = true;

  const runner1 = bases[0];
  const runner2 = bases[1];
  if (!runner1 || !runner2) return finishSteal(onComplete);

  const anim = [
    { from: 0, to: 1, player: runner1 },
    { from: 1, to: 2, player: runner2 },
  ];

  bases[2] = runner2;
  bases[1] = runner1;
  bases[0] = null;

  const catcher = players.find(p => p.name === 'Catcher');
  catcher.targetX = catcher.homeX;
  catcher.targetY = catcher.homeY;
  catcher.moving = true;

  runAnimations(anim, () => finishSteal(onComplete), true);
}

function finishSteal(onComplete, text = null) {
  runnersInMotion = false;
  runnersInStealing = false;
    hasThrownDuringSteal = false;  
  draw();
  endAnimation();

  const secondBaseFielder = players.find(p => p.name === "Polar_SecondBase");
  if (secondBaseFielder) {
    secondBaseFielder.x = centerX + baseDistance / 3;
    secondBaseFielder.y = homePlateY - baseDistance - 160;
  }

  const thirdBaseFielder = players.find(p => p.name === "Polar_ThirdBase");
    if (thirdBaseFielder) {
      thirdBaseFielder.x = centerX - baseDistance - 0;
      thirdBaseFielder.y = homePlateY - baseDistance - 70;
    }

  players.forEach(p => {
    if (p.waitToReturn) animatePolarBack(p);
  });

  setTimeout(() => {
    updateStealButtons();
    window.isStealOnly = false; 
  }, 600);

  const catcher = players.find(p => p.name === 'Catcher');
  catcher.targetX = catcher.homeX;
  catcher.targetY = catcher.homeY;
  catcher.moving = true;

  if (onComplete) onComplete();
}

const origDraw = window.draw;
window.draw = function () {
  origDraw();
  updateStealButtons();
};

updateStealButtons();

window.updateStealButtons = updateStealButtons;
window.startSteal1B2B = startSteal1B2B;
window.startSteal2B3B = startSteal2B3B;
window.startDoubleSteal = startDoubleSteal;
