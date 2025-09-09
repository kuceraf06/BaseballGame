function sendPlayerToDugout(side = 'left', player = null, onArrive = null) {
  startAnimation();
  const home = { x: centerX, y: homePlateY };
  const offset = 80;
  let targetX, targetY;

  if (side === 'left') {
    const angleLeft = Math.PI * 1.25;
    targetX = home.x + Math.cos(angleLeft) * 3 * offset;
    targetY = home.y + Math.sin(angleLeft) * 1.5 * offset;
  } else {
    const angleRight = Math.PI * 1.75;
    targetX = home.x + Math.cos(angleRight) * 2 * offset;
    targetY = home.y + Math.sin(angleRight) * 0.5 * offset;
  }

  dugoutRunners.push({
    x: home.x,
    y: home.y,
    targetX,
    targetY,
    speed: 0.26,
    color: side === 'left' ? '#1565c0' : '#c62828',
    player: player ? { name: player.name, img: player.img || palkarImg } : null,
    onArrive: (runner) => {
      if (typeof onArrive === "function") onArrive(runner);
      endAnimation();
    }
  });
}

function updateDugoutRunners() {
  for (let i = dugoutRunners.length - 1; i >= 0; i--) {
    const runner = dugoutRunners[i];
    const dx = runner.targetX - runner.x;
    const dy = runner.targetY - runner.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < runner.speed) {
      if (runner.onArrive) {
        try { runner.onArrive(runner); } catch (e) {}
      }
      dugoutRunners.splice(i, 1);
    } else {
      runner.x += (dx / dist) * runner.speed;
      runner.y += (dy / dist) * runner.speed;
    }
  }
}

function drawDugoutRunners() {
  dugoutRunners.forEach(runner => {
    if (runner.player && runner.player.img) {
      const img = runner.player.img;
      if (img.complete) {
        ctx.drawImage(img, runner.x - playerSize / 2, runner.y - playerSize / 2, playerSize, playerSize);
      } else {
        ctx.beginPath();
        ctx.arc(runner.x, runner.y, playerSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = runner.color || 'blue';
        ctx.fill();
      }

      if (runner.player.name) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(runner.player.name, runner.x, runner.y - playerSize / 2 - 5);
      }
    } 
  });
}

function startBatterToDugout(outBatter, side = 'right') {
  if (!outBatter) return;

  const runnerPlayer = {
    name: outBatter.name || "???",
    img: batterDugoutImg || palkarImg
  };

  sendPlayerToDugout(side, runnerPlayer, 3.0);
}   

function sendBatterFromOnDeck(newBatter, side = 'right', onArrive = null) {
  startAnimation();
  const home = { x: centerX, y: homePlateY };
  const offsetX = 90;
  const offsetY = 5;

  const onDeck = side === 'right'
    ? { x: centerX + offsetX, y: homePlateY - offsetY }
    : { x: centerX - offsetX, y: homePlateY - offsetY };

  hideBatterDuringOnDeckAnimation = true;

  dugoutRunners.push({
    x: onDeck.x,
    y: onDeck.y,
    targetX: home.x,
    targetY: home.y,
    speed: 0.20,
    color: side === 'left' ? '#1565c0' : '#c62828',
    player: { name: newBatter.name, img: batterDugoutImg || palkarImg },
    onArrive: () => {
      hideBatterDuringOnDeckAnimation = false;
      if (typeof onArrive === "function") onArrive();
      endAnimation();
    }
  });
}

function sendBatterFromDugoutToOnDeck(newBatter, side = 'right', onArrive = null) {
  startAnimation();
  const home = { x: centerX, y: homePlateY };
  const offset = 80;
  const offsetX = 90;
  const offsetY = 5;

  let dugoutX, dugoutY;
  if (side === 'left') {
    const angleLeft = Math.PI * 1.25;
    dugoutX = home.x + Math.cos(angleLeft) * 3 * offset;
    dugoutY = home.y + Math.sin(angleLeft) * 1.5 * offset;
  } else {
    const angleRight = Math.PI * 1.75;
    dugoutX = home.x + Math.cos(angleRight) * 2 * offset;
    dugoutY = home.y + Math.sin(angleRight) * 0.5 * offset;
  }

  const onDeck = side === 'right'
    ? { x: centerX + offsetX, y: homePlateY - offsetY }
    : { x: centerX - offsetX, y: homePlateY - offsetY };

  hideOnDeckDuringAnimation = true;
  currentOnDeckBatter = null;
            
  dugoutRunners.push({
    x: dugoutX,
    y: dugoutY,
    targetX: onDeck.x,
    targetY: onDeck.y,
    speed: 0.072,
    color: side === 'left' ? '#1565c0' : '#c62828',
    player: { 
      name: newBatter.name, 
      img: batterDugoutImg || palkarImg
    },
    onArrive: () => {
      hideOnDeckDuringAnimation = false;
      currentOnDeckBatter = newBatter;

      if (typeof onArrive === "function") onArrive();
      endAnimation();
    }
  });
}