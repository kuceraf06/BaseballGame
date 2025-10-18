let aiSwingPlanned = false;
function aiDecideSwing() {
  if (!aiBattingEnabled || !ball.active) return;

  let baseReactionTime = 150 + Math.random() * 350;
  let reactionMultiplier = 1;

  switch (selectedPitch) {
    case 'FB':
      reactionMultiplier = 1; 
      break;
    case 'CH':
      reactionMultiplier = 2; 
      break;
    case 'SL':
      reactionMultiplier = 1.3; 
      break;
    default:
  }

  const reactionTime = baseReactionTime * reactionMultiplier;
  aiSwingPlanned = true;

  setTimeout(() => {
    if (!ball.active || !aiSwingPlanned) return;

    const ballInZone =
      hitZone &&
      ball.x >= hitZone.x &&
      ball.x <= hitZone.x + hitZone.width &&
      ball.y >= hitZone.y &&
      ball.y <= hitZone.y + hitZone.height;

    let shouldSwing = false;

    if (ballInZone === true) {
      shouldSwing = Math.random() < 0.85;
    } else if (ballInZone === false) {
      shouldSwing = Math.random() < 0;
    } else {
      shouldSwing = false; 
    }

    if (shouldSwing) {
      swingActive = true;
      if (!hitRegistered) {
        hitRegistered = true;

        const hitSuccess = ballInZone && Math.random() < 0.75;
        evaluateResult(hitSuccess);
      }
      startSwingAnimation();
    } 
    else {
      swingActive = false;
      hitRegistered = false;

      const waitCheck = setInterval(() => {
        if (!ball.active) {
          clearInterval(waitCheck);
          evaluateResult();
        }
      }, 30);
    }
  }, reactionTime);
}

function aiOnPitchStart() {
  if (!aiBattingEnabled) return;

  resultEvaluated = false;
  hitRegistered = false;
  swingActive = false;

  aiSwingPlanned = false;

  if (!hitZone) {
    hitZone = {
      x: centerX - 12,
      y: homePlateY - 22,
      width: 24,
      height: 24
    };
  }

  const waitForBallActive = setInterval(() => {
    if (ball.active) {
      clearInterval(waitForBallActive);
      setTimeout(aiDecideSwing, 0);
    }
  }, 10);
}