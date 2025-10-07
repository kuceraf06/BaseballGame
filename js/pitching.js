const pitchTypeContainer = document.getElementById('pitchTypeContainer');

function updatePitchTypeButtonsPosition() {
  const pitcher = players.find(p => p.name === 'Nadhazovac');
  if (!pitcher) return;
  
  pitchTypeContainer.style.left = (pitcher.x + playerSize/2 - pitchTypeContainer.offsetWidth / 2 - 5) + 'px';
  pitchTypeContainer.style.top = (pitcher.y - 60) + 'px';
}

function strikeOut() {
  if (strikeoutInProgress) return;
  strikeoutInProgress = true;

  atBatOver = true;

  hitRegistered = false;
  swingActive = false;

  const pitcher = players.find(p => p.name === "Nadhazovac");
  ball.x = ball.startX = pitcher.x + playerSize/2;
  ball.y = ball.startY = pitcher.y + playerSize/2;
  ball.endX = ball.x;
  ball.endY = ball.y;
  ball.progress = 0;
  ball.active = false;
  ball.inPlay = false;

  if (battersQueue.length > 0) {
    const batterOut = nextBatter();
    startBatterToDugout(batterOut, 'right');

    hideBatterDuringOnDeckAnimation = true;

    const newBatter = battersQueue[0];
    const nextOnDeck = battersQueue.length > 1 ? battersQueue[1] : null;

    if (nextOnDeck) {
      sendBatterFromDugoutToOnDeck(nextOnDeck, 'right');
    }

    if (newBatter) {
      sendBatterFromOnDeck(newBatter, 'right', () => {
        hideBatterDuringOnDeckAnimation = false;
        resetCount();
        strikeoutInProgress = false;

        const catcher = players.find(p => p.name === 'Catcher');
        catcher.targetX = catcher.homeX;
        catcher.targetY = catcher.homeY;
        catcher.moving = true;
      });
    } else {
      hideBatterDuringOnDeckAnimation = false;
      resetCount();
      strikeoutInProgress = false;

      const catcher = players.find(p => p.name === 'Catcher');
      catcher.targetX = catcher.homeX;
      catcher.targetY = catcher.homeY;
      catcher.moving = true;
    }
  }

  addOut();

  if (typeof resetSwingState === 'function') resetSwingState();

  ball.active = false;
  ball.inPlay = false;
  ball.owner = "pitcher";
  preventReturnToPitcher = false;

  draw();
}

function ballFour() {
  lastPlayType = "BALLFOUR";
  atBatOver = true;

  const pitcher = players.find(p => p.name === "Nadhazovac");
  ball.x = ball.startX = pitcher.x + playerSize/2;
  ball.y = ball.startY = pitcher.y + playerSize/2;
  ball.endX = ball.x;
  ball.endY = ball.y;
  ball.progress = 0;
  ball.active = false;
  ball.inPlay = false;

  if (battersQueue.length > 0) {
    const batterOut = nextBatter();
    const newRunner = { name: batterOut.name, img: bezecImg };

    animateRunnerToFirstBase(newRunner);

    const newBatter = battersQueue[0];
    const nextOnDeck = battersQueue.length > 1 ? battersQueue[1] : null;

    if (nextOnDeck) {
      sendBatterFromDugoutToOnDeck(nextOnDeck, 'right');
    }

    if (newBatter) {
      sendBatterFromOnDeck(newBatter, 'right', () => {
        resetCount();
        draw();
      });
    } else {
      resetCount();
      draw();
    }
  }

  const catcher = players.find(p => p.name === 'Catcher');
  catcher.targetX = catcher.homeX;
  catcher.targetY = catcher.homeY;
  catcher.moving = true;

  if (typeof resetSwingState === 'function') resetSwingState();

  draw();
}

const ball = {
  active: false,
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  progress: 0,
  owner: "pitcher",
  isSliderFlight: false,
  size: 8,
};

const slider = {
  active: false,
  x: canvas.width / 2 - 165,
  y: 121,
  width: 350,
  height: 25,
  handleX: canvas.width / 2 - 150,
  speed: 3,
  stopped: false,
  result: null
};

function drawSlider() {
  if (!slider.active) return;

  const total = slider.width;
  const gray1 = total * 0.525;
  const blue = total * 0.325;
  const green = total * 0.1;
  const gray2 = total * 0.06;

  let offset = slider.x;
  ctx.fillStyle = 'gray';
  ctx.fillRect(offset, slider.y, gray1, slider.height);

  offset += gray1;
  ctx.fillStyle = 'blue';
  ctx.fillRect(offset, slider.y, blue, slider.height);

  offset += blue;
  ctx.fillStyle = 'green';
  ctx.fillRect(offset, slider.y, green, slider.height);

  offset += green;
  ctx.fillStyle = 'gray';
  ctx.fillRect(offset, slider.y, gray2, slider.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(slider.handleX - 2, slider.y, 4, slider.height);
}

let lastSliderTime = null;

function updateSlider(now = performance.now()) {
  if (!slider.active || slider.stopped) {
    lastSliderTime = null; 
    return;
  }

  if (!lastSliderTime) lastSliderTime = now;
  const delta = now - lastSliderTime;
  lastSliderTime = now;

  const speedPerMs = 0.4;
  slider.handleX += speedPerMs * delta;

  if (slider.handleX > slider.x + slider.width) {
    slider.stopped = true;

    const pitcher = players.find(p => p.name === 'Nadhazovac');
    const catcher = players.find(p => p.name === 'Catcher');

    ball.startX = pitcher.x + playerSize / 2;
    ball.startY = pitcher.y + playerSize / 2;
    ball.endX = catcher.x + playerSize / 2 + 20;
    ball.endY = catcher.y + playerSize / 2;
    ball.x = ball.startX;
    ball.y = ball.startY;
    ball.progress = 0;
    ball.active = true;

    aiOnPitchStart();

    catcher.targetX = ball.endX - playerSize / 2;
    catcher.targetY = ball.endY - playerSize / 2;
    catcher.moving = true;

    draw();
    ball.isSliderFlight = (selectedPitch === 'SL');

    let speedFactor;
    switch (selectedPitch) {
      case 'FB': speedFactor = 0.011; break;
      case 'CH': speedFactor = 0.005; break;
      case 'SL': speedFactor = 0.008; break;
      default: speedFactor = 0.01; break;
    }

    animateBall(() => {
      ball.owner = "catcher";
      lastPitch = selectedPitch;

      if (ballCount >= 4) {
        preventReturnToPitcher = true;
        atBatOver = true;

        setTimeout(() => {
          ballFour();
          resetCount();
        }, 20);
      }

      setTimeout(() => {
        if (!preventReturnToPitcher) {
          returnBallToPitcher();
        }
        preventReturnToPitcher = false;
      }, 800);
    }, speedFactor);

  }
}
    
function evaluatePitch() {
  const total = slider.width;
  const gray1 = total * 0.5;
  const blue = total * 0.3;
  const green = total * 0.15;
  const gray2 = total * 0.05;

  const pos = slider.handleX - slider.x;

  if (pos < gray1) return 'BALL';
  else if (pos < gray1 + blue) return Math.random() < 0.5 ? 'BALL' : 'STRIKE';
  else if (pos < gray1 + blue + green) return 'STRIKE';
  else return 'BALL';
}

function resetCount() {
  strikeCount = 0;
  ballCount = 0;
}

document.querySelectorAll('.pitchTypeBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedPitch = btn.dataset.pitch;
    document.querySelectorAll('.pitchTypeBtn').forEach(b => b.classList.remove('activePitch'));
    btn.classList.add('activePitch');
  });
});

function resetSwingState() {
  hitRegistered = false;
  swingActive = false;
  swingAllowed = false;
}

function startPitch() {
  if (animationInProgress || gameState !== 'defense' || slider.active) return;

  slider.active = true;
  slider.stopped = false;
  slider.result = null;
  slider.handleX = slider.x;

  if (typeof resetSwingState === 'function') resetSwingState();

  draw();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameState === 'defense' && !pickoffInProgress && slider.active && !slider.stopped) {
    slider.stopped = true;
    slider.result = evaluatePitch();

    swingActive = true;
    swingAllowed = false;

    hitRegistered = false;

    let delay = 500;

    setTimeout(() => {
      const pitcher = players.find(p => p.name === 'Nadhazovac');
      const catcher = players.find(p => p.name === 'Catcher');
      ball.startX = pitcher.x + playerSize / 2;
      ball.startY = pitcher.y + playerSize / 2;
      ball.endX = catcher.x + playerSize / 2 + (slider.result === 'BALL' ? 20 : 0);
      ball.endY = catcher.y + playerSize / 2;

      catcher.targetX = ball.endX - playerSize / 2;
      catcher.targetY = ball.endY - playerSize / 2;
      catcher.moving = true;

      ball.x = ball.startX;
      ball.y = ball.startY;
      ball.progress = 0;
      ball.active = true;

      aiOnPitchStart();

      pitchTypeContainer.style.display = 'none';
      hidePickoffButtons();

      slider.active = false;
      draw();

      ball.isSliderFlight = (selectedPitch === 'SL');

      let speedFactor;
      switch(selectedPitch) {
        case 'FB': speedFactor = 0.011; break;
        case 'CH': speedFactor = 0.005; break;
        case 'SL': speedFactor = 0.008; break;
      }

      animateBall(() => {
        ball.owner = "catcher";
        lastPitch = selectedPitch;
        setTimeout(() => {
          if (!preventReturnToPitcher) {
            returnBallToPitcher();
          }
          preventReturnToPitcher = false;
        }, 800);
    }, speedFactor);

const waitForBallDone = setInterval(() => {
  if (!ball.active) {
    clearInterval(waitForBallDone);

    if (typeof aiBattingEnabled !== "undefined" && aiBattingEnabled) {
      return;
    }

    evaluateResult();
  }
}, 50);

    }, delay);
  }
});

function drawBall() {
  if ((ball.active || ball.inPlay) && ballImg.complete) {
    const z = ball.z || 0;
    const half = ball.size / 2;
    ctx.drawImage(ballImg, ball.x - half, (ball.y - z) - half, ball.size, ball.size);
  }
}

function animateBall(onComplete, speed = 0.01, lastTime = null) {
  if (!ball.active) return;

  startAnimation();
  
  const now = performance.now();
  if (!lastTime) lastTime = now;
  const delta = now - lastTime;

  ball.progress += speed * delta * (180 / 1000);
  if (ball.progress >= 1) {
    ball.active = false;
    slider.active = false;
    slider.stopped = false;

    ball.x = ball.endX;
    ball.y = ball.endY;

    if ((gameState === 'offense' || aiBattingEnabled) && hitRegistered) {
      ball.inPlay = true;
    } else {
      ball.inPlay = false;
    }

    draw();
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  ball.x = ball.startX + (ball.endX - ball.startX) * ball.progress;
  ball.y = ball.startY + (ball.endY - ball.startY) * ball.progress;

  if (ball.isSliderFlight) {
    const slideAmount = 15; 
    const slideOffset = Math.sin(ball.progress * Math.PI) * slideAmount; 
    ball.x += slideOffset;
  }

  if (!swingAllowed && hitZone) {
    if (ball.y >= hitZone.y) swingAllowed = true;
  }

  if ((gameState === 'offense' || aiBattingEnabled) &&
    swingActive && swingAllowed && hitZone && !hitRegistered) {

    const ballInZone = (
      ball.x >= hitZone.x &&
      ball.x <= hitZone.x + hitZone.width &&
      ball.y >= hitZone.y &&
      ball.y <= hitZone.y + hitZone.height
    );

    if (ballInZone || !hitRegistered) {
      hitRegistered = true;
      evaluateResult(ballInZone);
    }
  }
  else if (gameState === 'defense' && !aiBattingEnabled) {
    if (!ball.active) evaluateResult();
  }
  
  draw();
  requestAnimationFrame(() => animateBall(onComplete, speed, now));
}

function returnBallToPitcher() {
  startAnimation();

  const pitcher = players.find(p => p.name === "Nadhazovac");
  let ownerX, ownerY;

  if (ball.owner === "catcher") {
    const catcher = players.find(p => p.name === "Catcher");
    ownerX = catcher.x + playerSize / 2;
    ownerY = catcher.y + playerSize / 2;
  } else if (ball.owner === "polar") {
    const polar = players.find(p => p.name === "Polar_SecondBase");
    ownerX = polar.x + playerSize / 2;
    ownerY = polar.y + playerSize / 2;
  } else if (ball.owner === "firstBase") {
    const base = POS.FIRST;
    ownerX = base.x + playerSize / 2;
    ownerY = base.y + playerSize / 2;
  } else {
    ownerX = ball.x;
    ownerY = ball.y;
  }

  ball.startX = ownerX;
  ball.startY = ownerY;
  ball.endX = pitcher.x + playerSize / 2;
  ball.endY = pitcher.y + playerSize / 2;
  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  ball.isSliderFlight = false;

  const returnSpeed = 0.0075;
  animateBall(() => {
    ball.owner = "pitcher";
    const catcher = players.find(p => p.name === 'Catcher');
    catcher.targetX = catcher.homeX;
    catcher.targetY = catcher.homeY;
    catcher.moving = true;

    slider.active = false;
    slider.stopped = false;

    if (typeof resetSwingState === 'function') resetSwingState();

    endAnimation();
  }, returnSpeed);
}

