function aiPitch() {
  if (animationInProgress || gameState !== 'offense') return;

  if (runnerOnFirstBase && Math.random() < 0.08) {
    startPickoff1B();
    return;
  }
  if (runnerOnSecondBase && Math.random() < 0.04) {
    startPickoff2B();
    return;
  }
  if (runnerOnThirdBase && Math.random() < 0.02) {
    startPickoff3B();
    return;
  }

  const isStrike = Math.random() < 0.65;
  const pitchTypes = ['FB', 'CH', 'SL'];
  const chosenPitch = pitchTypes[Math.floor(Math.random() * pitchTypes.length)];
  selectedPitch = chosenPitch;

  slider.result = isStrike ? "STRIKE" : "BALL";

  const pitcher = players.find(p => p.name === 'Nadhazovac');
  const catcher = players.find(p => p.name === 'Catcher');

  ball.startX = pitcher.x + playerSize / 2;
  ball.startY = pitcher.y + playerSize / 2;
  ball.endX = catcher.x + playerSize / 2 + (slider.result === 'BALL' ? 25 : 0);
  ball.endY = catcher.y + playerSize / 2;

  catcher.targetX = ball.endX - playerSize / 2;
  catcher.targetY = ball.endY - playerSize / 2;
  catcher.moving = true;

  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  ball.isSliderFlight = (chosenPitch === 'SL');

  startAnimation();

  let speedFactor;
  switch (chosenPitch) {
    case 'FB': speedFactor = 0.011; break;
    case 'CH': speedFactor = 0.005; break;
    case 'SL': speedFactor = 0.008; break;
    default: speedFactor = 0.01;
  }

  animateBall(() => {
    ball.owner = "catcher";
    if (!endOfAtBat) {
      setTimeout(() => {
        if (strikeCount < 3 && ballCount < 4) {
          returnBallToPitcher();
        }
      }, 800);
    }
  }, speedFactor);
  const waitForBallDone = setInterval(() => {
    if (!ball.active) {
      clearInterval(waitForBallDone);
      evaluateResult();
    }
  }, 50);
}

throwButtonEl.addEventListener('click', () => {
  if (gameState === 'offense' && !animationInProgress) {
    resultDisplay.textContent = "Pitcher is preparing...";
    resultDisplay.style.color = "black";
    setTimeout(aiPitch, 600 + Math.random() * 750);
  }
});
