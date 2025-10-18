// =========================
// THROW CONTROLLER LOGIC
// =========================

function getFielderPosition(owner) {
  switch (owner) {
    case "firstBase": {
      const player = players.find(p => p.name === "Polar_FirstBase");
      if (player && runnersInStealing) {
        // pickoff pozice, když běží steal
        return {
          ...player,
          x: POS.FIRST.x - 15,
          y: POS.FIRST.y - 5
        };
      }
      return player;
    }
    case "secondBase":
      return players.find(p => p.name === "Polar_SecondBase");
    case "thirdBase":
      return players.find(p => p.name === "Polar_ThirdBase");
    case "pitcher":
      return players.find(p => p.name === "Nadhazovac");
    case "polar": // nově přidané, fallback na druhou metu
      return players.find(p => p.name === "Polar_SecondBase") || 
             players.find(p => p.name === "Polar_ThirdBase");
    default:
      return null;
  }
}

// Mapování labelu (cíle na kontroleru) na vlastníka míče
function getTargetOwner(targetBaseLabel) {
  switch (targetBaseLabel) {
    case "1B": return "firstBase";
    case "2B": return "secondBase";
    case "3B": return "thirdBase";
    default: return null;
  }
}

function throwBall(fromOwner, targetBaseLabel) {
  const pitcher = players.find(p => p.name === "Nadhazovac");
  if (pitcher && slider.active) return;

  const fromPlayer = getFielderPosition(fromOwner) || players.find(p => p.name === "Nadhazovac");
  const toOwner = getTargetOwner(targetBaseLabel);
  const toPlayer = getFielderPosition(toOwner);
  if (!fromPlayer || !toPlayer) return;

  let startX = fromPlayer.x + playerSize / 2;
  let startY = fromPlayer.y + playerSize / 2;

  if (fromPlayer.name === 'Polar_FirstBase' && runnersInStealing) {
    startX = POS.FIRST.x - 15 + playerSize / 2;  // posun x
    startY = POS.FIRST.y - 5 + playerSize / 2;   // posun y
  }

  if (toOwner === "secondBase") {
    const secondBaseFielder = players.find(p => p.name === "Polar_SecondBase");
    if (secondBaseFielder) {
      secondBaseFielder.x = POS.SECOND.x;
      secondBaseFielder.y = POS.SECOND.y;
    }
  }

  if (toOwner === "thirdBase") {
    const thirdBaseFielder = players.find(p => p.name === "Polar_ThirdBase");
    if (thirdBaseFielder) {
      thirdBaseFielder.x = POS.THIRD.x;
      thirdBaseFielder.y = POS.THIRD.y;
    }
  }

  ball.startX = startX;
  ball.startY = startY;
  ball.endX = toPlayer.x + playerSize / 2;
  ball.endY = toPlayer.y + playerSize / 2;
  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  pickoffInProgress = true;
  startAnimation();

  const throwSpeed = 350;
  let lastTime = performance.now(); 

function slowThrowStep(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    const dx = ball.endX - ball.startX;
    const dy = ball.endY - ball.startY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const move = throwSpeed * deltaTime;

    if (distance <= move || ball.progress >= 1) {
      ball.x = ball.endX;
      ball.y = ball.endY;
      ball.progress = 1;
      ball.owner = toOwner;
      pickoffInProgress = false;
      endAnimation();
      draw();
      return;
    }

    ball.progress += move / distance;
    ball.x = ball.startX + dx * ball.progress;
    ball.y = ball.startY + dy * ball.progress;

    draw();
    requestAnimationFrame(slowThrowStep);
  }

  requestAnimationFrame(slowThrowStep);
}