const pitchTypeContainer = document.getElementById('pitchTypeContainer');

function updatePitchTypeButtonsPosition() {
  const pitcher = players.find(p => p.name === 'Nadhazovac');
  if (!pitcher) return;
  
  pitchTypeContainer.style.left = (pitcher.x + playerSize/2 - pitchTypeContainer.offsetWidth / 2) + 'px';
  pitchTypeContainer.style.top = (pitcher.y - 60) + 'px'; // 60px nad hlavou
}

function strikeOut() {
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
      });
    } else {
      hideBatterDuringOnDeckAnimation = false;
      resetCount();
    }
  }
  draw();
}

function ballFour() {
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
  isSliderFlight: false 
};

const slider = {
  active: false,
  x: canvas.width / 2 - 150,
  y: 20,
  width: 300,
  height: 20,
  handleX: canvas.width / 2 - 150,
  speed: 2,
  stopped: false,
  result: null
};

function drawSlider() {
  if (!slider.active) return;

  const total = slider.width;
  const gray1 = total * 0.5;
  const blue = total * 0.3;
  const green = total * 0.15;
  const gray2 = total * 0.05;

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

function updateSlider() {
  if (!slider.active || slider.stopped) return;
  slider.handleX += slider.speed;

  if (slider.handleX > slider.x + slider.width) {
    slider.stopped = true;
    slider.result = 'BALL';
    resultDisplay.textContent = slider.result;
    resultDisplay.style.color = 'red';
    ballCount++;
    updateCountDisplay();

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

    catcher.targetX = ball.endX - playerSize / 2;
    catcher.targetY = ball.endY - playerSize / 2;
    catcher.moving = true;
    
    draw();
    animateBall(() => {
      ball.owner = "catcher";

      if (strikeCount < 3 && ballCount < 4) {
        setTimeout(() => returnBallToPitcher(), 800);
      }
    });

    ballCountInProgress = true;

    const waitForBall = setInterval(() => {
      if (!ball.active) {
        clearInterval(waitForBall);
        ballCountInProgress = false;

        if (ballCount >= 4 && battersQueue.length > 0) {
          resultDisplay.textContent = 'BALL FOUR';
          resultDisplay.style.color = 'red';
          ballFour();
          resetCount();
        }
      }
    }, 50);
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

let strikeCount = 0;
let ballCount = 0;

function updateCountDisplay() {
  const display = document.getElementById('countDisplay');
  const batterName = battersQueue.length > 0 ? battersQueue[0].name : "No batter";
  display.textContent = `Balls: ${ballCount} | Strikes: ${strikeCount} | Now batting: ${batterName}`;
}

updateCountDisplay();

function resetCount() {
  strikeCount = 0;
  ballCount = 0;
  updateCountDisplay();
}

let selectedPitch = 'FB';

document.querySelectorAll('.pitchTypeBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedPitch = btn.dataset.pitch;
    document.querySelectorAll('.pitchTypeBtn').forEach(b => b.classList.remove('activePitch'));
    btn.classList.add('activePitch');
  });
});

function startPitch() {
  if (animationInProgress) return;

  slider.active = true;
  slider.stopped = false;
  slider.result = null;
  slider.handleX = slider.x;

  resultDisplay.textContent = '';

  draw();
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && slider.active && !slider.stopped) {
    slider.stopped = true;
    slider.result = evaluatePitch();
    
    resultDisplay.textContent = slider.result;
    resultDisplay.style.color = slider.result === 'STRIKE' ? 'green' : 'red';

    if (slider.result === 'STRIKE') strikeCount++;
    if (slider.result === 'BALL') {
      ballCount++;
    }
    updateCountDisplay();

    let delay = 500;

    if (strikeCount >= 3) {
      resultDisplay.textContent = 'STRIKEOUT';
      resultDisplay.style.color = 'green';
      delay = 1000;
    } else if (ballCount >= 4) {
      resultDisplay.textContent = 'BALL FOUR';
      resultDisplay.style.color = 'red';
      delay = 1000;
    }

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

        if (strikeCount < 3 && ballCount < 4) {
          setTimeout(() => returnBallToPitcher(), 800);
        }
      }, speedFactor);

      const waitForBallDone = setInterval(() => {
        if (!ball.active) {
          clearInterval(waitForBallDone);
          ballCountInProgress = false;

          if (strikeCount >= 3) {
            sendPlayerToDugout('right');
            strikeOut();
            resetCount();
          }

          if (ballCount >= 4) {
            ballFour();
          }

          // reset counts
          if (ballCount >= 4) resetCount();
          if (strikeCount >= 3 && !batterRunningToDugout) {
            resetCount();
          }
        }
      }, 50);
    }, delay);
  }
});

function drawBall() {
  if (ball.active && ballImg.complete) {
    ctx.drawImage(ballImg, ball.x - 5, ball.y - 5, 7.5, 7.5);
  }
}

function animateBall(onComplete, speed = 0.01) {
  if (!ball.active) return;

  startAnimation();

  ball.progress += speed;
  if (ball.progress >= 1) {
    ball.active = false;
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

  draw();
  requestAnimationFrame(() => animateBall(onComplete, speed));
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

    endAnimation();
  }, returnSpeed);
}
