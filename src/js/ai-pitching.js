function aiPitch() {
  if (gameState !== 'offense') return;
  if (animationInProgress && !runnersInMotion) return;

  resultEvaluated = false;
  hitRegistered = false;
  swingActive = false;

  if (runnerOnFirstBase && Math.random() < 0.16) {
    startPickoff1B();
    return;
  }
  if (runnerOnSecondBase && Math.random() < 0.08) {
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

  if (throwSound) {
    throwSound.currentTime = 0;
    throwSound.play().catch(() => {});
  }


  let speedFactor;
  switch (chosenPitch) {
    case 'FB': speedFactor = 0.011; break;
    case 'CH': speedFactor = 0.005; break;
    case 'SL': speedFactor = 0.008; break;
    default: speedFactor = 0.01;
  }

  animateBall(() => {
    ball.owner = "catcher";
    lastPitch = chosenPitch;
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
      evaluateResult();
    }
  }, 50);
}

throwButtonEl.addEventListener('click', () => {
  if (gameState === 'offense' && !animationInProgress) {
    setTimeout(aiPitch, 600 + Math.random() * 750);
  }
});
