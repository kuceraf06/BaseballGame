function drawRunScored() {
  if (runScoredText) {
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText(runScoredText, centerX, homePlateY - 250);
  }
}

function incrementTeamBScore(scoringRunner) {
  teamBScore++;
  runScoredText = 'RUN SCORED!';
  if (scoringRunner) {
    startBatterToDugout(scoringRunner, 'right');
  }
  clearTimeout(runScoredTimeout);
  runScoredTimeout = setTimeout(() => {
    runScoredText = '';
  }, 2000);
}

function animateRunnerToFirstBase(newRunner) {
  startAnimation();
  runnersInMotion = true;
  const runners = [];

  function getRunnerStart(runner, pos, offsetX = 0, offsetY = 0) {
    if (runner.x !== undefined && runner.y !== undefined) {
      return { x: runner.x, y: runner.y };
    }
    return { x: pos.x + offsetX, y: pos.y + offsetY };
  }

  if (runnerOnThirdBase) {
    const startPos = getRunnerStart(runnerOnThirdBase, POS.THIRD, +25, +25)

    runners.push({
      from: startPos,
      to: { ...POS.HOME },
      player: runnerOnThirdBase,
      update: () => {
        const scoringRunner = runnerOnThirdBase;
        runnerOnThirdBase = null;
        incrementTeamBScore(scoringRunner);
      }
    });
  }

  // 2B -> 3B
  if (runnerOnSecondBase) {
    const startPos = getRunnerStart(runnerOnSecondBase, POS.SECOND, -25, +25);

    runners.push({
      from: startPos,
      to: { ...POS.THIRD },
      player: runnerOnSecondBase,
      update: () => {
        runnerOnThirdBase = runnerOnSecondBase;
        runnerOnSecondBase = null;
      }
    });
  }

  // 1B -> 2B
  if (runnerOnFirstBase) {
    const startPos = getRunnerStart(runnerOnFirstBase, POS.FIRST, -25, -25);

    runners.push({
      from: startPos,
      to: { ...POS.SECOND },
      player: runnerOnFirstBase,
      update: () => {
        runnerOnSecondBase = runnerOnFirstBase;
        runnerOnFirstBase = null;
      }
    });
  }

  runners.push({
    from: { ...POS.HOME },
    to: { ...POS.FIRST },
    player: newRunner,
    update: () => {
      runnerOnFirstBase = newRunner;
    }
  });

  runners.forEach(r => r.progress = 0);

  function drawRunners() {
    let allDone = true;
    draw();

    runners.forEach(runner => {
      if (runner.progress < 1) {
        runner.progress += 1 / (60 * 7.5);
        const x = runner.from.x + (runner.to.x - runner.from.x) * runner.progress;
        const y = runner.from.y + (runner.to.y - runner.from.y) * runner.progress;


        const sprite = runner.player && runner.player.img ? runner.player.img : bezecImg;

        const dx = runner.to.x - runner.from.x;
        const dy = runner.to.y - runner.from.y;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(x + playerSize / 2, y + playerSize / 2);
        ctx.rotate(angle);
        ctx.drawImage(sprite, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
        ctx.restore();

        if (runner.player && runner.player.name) {
          ctx.font = "12px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(runner.player.name, x + playerSize / 2, y - 5);
        }

        allDone = false;
      } else if (runner.progress >= 1 && typeof runner.update === 'function') {
        runner.update();
        runner.update = null;
      }
    });

    if (!allDone) {
      requestAnimationFrame(drawRunners);
    } else {
      runnersInMotion = false;
      draw();
      if (onComplete) onComplete();
      endAnimation();
    }
  }
  drawRunners();
}

function drawRun(runner, pos) {
  const LEAD_OFFSET = 25;

  let centerX = (runner.x !== undefined) ? runner.x : pos.x + playerSize / 2;
  let centerY = (runner.y !== undefined) ? runner.y : pos.y + playerSize / 2;

  if (runner.x === undefined && pos === POS.FIRST) {
    centerX -= LEAD_OFFSET;
    centerY -= LEAD_OFFSET;
  }
  if (runner.x === undefined && pos === POS.SECOND) {
    centerX -= LEAD_OFFSET;
    centerY += LEAD_OFFSET;
  }
  if (runner.x === undefined && pos === POS.THIRD) {
    centerX += LEAD_OFFSET;
    centerY += LEAD_OFFSET;
  }

  let dx = 0, dy = 0;
  if (pos === POS.FIRST) { dx = 1; dy = 1; }
  if (pos === POS.SECOND) { dx = 1; dy = -1; }
  if (pos === POS.THIRD) { dx = -1; dy = -1; }
  if (pos === POS.HOME) { dx = 0; dy = -1; }

  const angle = Math.atan2(dy, dx);
  let extraRotation = 0;

  let imgToDraw = benchPlayerImg; 
  if (runner.state === "sliding") {
    imgToDraw = slideImg;
    extraRotation = 12.25 / Math.PI;   
  } else if (runner.state === "returning") {
    imgToDraw = bezecImg;
    extraRotation = Math.PI;
  } else if (runner.state === "lead") {
    imgToDraw = benchPlayerImg;
    extraRotation = 0;   
  }

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle + extraRotation);
  ctx.drawImage(imgToDraw, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
  ctx.restore();

  if (!runScoredText && runner.name) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(runner.name, centerX, centerY - playerSize / 2 - 5);
  }

  drawRunScored();
}