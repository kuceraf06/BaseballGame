// AI pickoff logika, používá existující throwBall z throwing.js
function aiPickoff() {
  if (!runnersInStealing || pickoffInProgress) return;

  let targetBaseLabel = null;
  if (stealAttempt2B && !stealAttempt3B) targetBaseLabel = "2B";
  else if (!stealAttempt2B && stealAttempt3B) targetBaseLabel = "3B";
  else if (stealAttempt2B && stealAttempt3B) targetBaseLabel = "3B"; // double steal

  if (!targetBaseLabel) return;

  // Hod od nadhazovače
  const fromOwner = "pitcher";

  pickoffInProgress = true;
  throwBall(fromOwner, targetBaseLabel);

  // Po dokončení throwBall, spustíme animaci fieldera
  const checkBallDone = setInterval(() => {
    if (!pickoffInProgress) {
      clearInterval(checkBallDone);

      // spustíme animaci hráče, který míč chytal
      const fielder = getFielderPosition(getTargetOwner(targetBaseLabel));
      if (!fielder) return;

      animatePolarToBase(fielder, targetBaseLabel, () => {
        returnBallToPitcher();
      });
    }
  }, 50);
}

// animace fieldera na metu (po pickoff hodu)
function animatePolarToBase(fielder, targetBaseLabel, onComplete) {
  let basePos;
  switch (targetBaseLabel) {
    case "2B": basePos = POS.SECOND; break;
    case "3B": basePos = POS.THIRD; break;
    default: return;
  }

  const startX = fielder.x;
  const startY = fielder.y;
  const targetX = basePos.x + playerSize / 2;
  const targetY = basePos.y + playerSize / 2;
  const duration = 500;

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    fielder.x = startX + (targetX - startX) * progress;
    fielder.y = startY + (targetY - startY) * progress;

    draw();

    if (progress < 1) requestAnimationFrame(animate);
    else {
      if (typeof onComplete === "function") onComplete();
    }
  }

  requestAnimationFrame(animate);
}

window.aiPickoff = aiPickoff;
