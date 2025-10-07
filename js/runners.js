function drawRunScored() {
  if (runScoredText) {
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = 'gold';
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

function advanceRunners(basesToAdvance, newBatter = null) {
  const animations = [];

  for (let i = 2; i >= 0; i--) {
    const runner = bases[i];
    if (runner) {
      const newIndex = i + basesToAdvance;
      if (newIndex >= 3) {
        animations.push({ from: i, to: "HOME", player: runner, score: true });
      } else {
        bases[newIndex] = runner;
        animations.push({ from: i, to: newIndex, player: runner });
      }
      bases[i] = null;
    }
  }

  if (newBatter) {
    if (basesToAdvance >= 4) {
      animations.push({ from: "HOME", to: "HOME", player: newBatter, score: true });
    } else {
      bases[basesToAdvance - 1] = newBatter;
      animations.push({ from: "HOME", to: basesToAdvance - 1, player: newBatter });
    }
  }

  return animations;
}

function animateRunnerToFirstBase(newRunner) {
  startAnimation();
  runnersInMotion = true;

  const animations = advanceRunners(1, newRunner);
  runAnimations(animations, () => {
    runnersInMotion = false;
    draw();
    endAnimation();
  });
}

function animateHitRunners(hitType, batter, onComplete) {
  lastPlayType = "HIT";
  startAnimation();
  runnersInMotion = true;
  hideBatterDuringOnDeckAnimation = true;

  let basesToAdvance = 1;
  if (hitType === "DOUBLE") basesToAdvance = 2;
  else if (hitType === "TRIPLE") basesToAdvance = 3;
  else if (hitType === "HOMERUN") basesToAdvance = 4;

  const animations = advanceRunners(basesToAdvance, batter);

  runAnimations(animations, () => {
    runnersInMotion = false;

    ball.active = false;
    hitRegistered = false;
    swingActive = false;
    atBatOver = true;
    preventReturnToPitcher = false;

    if (!runScoredText) {
      if (hitType === "HOMERUN") {
        showResultText("RUN SCORED!", "gold", 2000);
      } else {
        showResultText(hitType, "blue", 2000);
      }
    }

    resetCount();
    draw();

    if (batter) {
      battersQueue.push(batter);  // vrať pálkaře na konec fronty
    }

    if (onComplete) onComplete();
    endAnimation();
  });
}

function expandAnimations(animations) {
  const expanded = [];

  animations.forEach(anim => {
    const fromIndex = anim.from;
    const toIndex = anim.to;
    const player = anim.player;

    const fromBase = (fromIndex === "HOME") ? -1 : fromIndex;
    const toBase = (toIndex === "HOME") ? 3 : toIndex;

    const steps = [];
    for (let i = fromBase + 1; i <= toBase; i++) {
      let stepFrom = (i - 1 < 0) ? "HOME" : i - 1;
      let stepTo = (i === 3 && toIndex === "HOME") ? "HOME" : i;
      steps.push({ from: stepFrom, to: stepTo });
    }

    expanded.push({ player, steps, score: anim.score || false });
  });

  return expanded;
}

function runAnimations(animations, onComplete) {
  const expanded = expandAnimations(animations);

  const runners = expanded.map(anim => ({
    player: anim.player,
    steps: anim.steps,
    currentStep: 0,
    progress: 0,
    score: anim.score
  }));

  let lastTime = performance.now();
  const runnerSpeed = 3;

  function drawRunners(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    draw();
    let allDone = true;

    runners.forEach(runner => {
      if (runner.currentStep < runner.steps.length) {
        const step = runner.steps[runner.currentStep];
        let fromPos;
        if (runner.currentStep === 0) {
          if (runner.player.x !== undefined && runner.player.y !== undefined) {
            fromPos = { x: runner.player.x, y: runner.player.y };
          } else {
            const basePos = getBasePosition(step.from);
            const LEAD_OFFSET = 30;
            let leadX = basePos.x + playerSize / 2;
            let leadY = basePos.y + playerSize / 2;

            if (step.from === 0) {
              leadX -= LEAD_OFFSET;
              leadY -= LEAD_OFFSET;
            } else if (step.from === 1) {
              leadX -= LEAD_OFFSET + 13;
              leadY += LEAD_OFFSET;
            } else if (step.from === 2) {
              leadX += LEAD_OFFSET;
              leadY += LEAD_OFFSET;
            }

            fromPos = { x: leadX, y: leadY };
          }
        } else {
          fromPos = getBasePosition(step.from);
        }

        const toPos = getBasePosition(step.to);

        if (runner.progress < 1) {
          runner.progress += deltaTime * runnerSpeed / 7.5;
          if (runner.progress > 1) runner.progress = 1;

          const x = fromPos.x + (toPos.x - fromPos.x) * runner.progress;
          const y = fromPos.y + (toPos.y - fromPos.y) * runner.progress;

          ctx.save();
          ctx.translate(x + playerSize / 2, y + playerSize / 2);
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          ctx.rotate(Math.atan2(dy, dx));
          ctx.drawImage(bezecImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
          ctx.restore();

          if (runner.player && runner.player.name) {
            ctx.font = "12px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.fillText(runner.player.name, x + playerSize / 2, y - 5);
          }

          allDone = false;
        } else {
          // krok dokončen → přejdi na další
          runner.currentStep++;
          runner.progress = 0;
          if (runner.currentStep >= runner.steps.length && runner.score) {
            incrementTeamBScore(runner.player);
          }

          if (runner.currentStep < runner.steps.length) {
            allDone = false;
          }
        }
      }
    });

    if (!allDone) {
      requestAnimationFrame(drawRunners);
    } else {
      // --- všechny běhy dokončeny ---
      if (onComplete) onComplete();

      ball.active = false;
      ball.x = null;
      ball.y = null;
      ball.z = 0;

      if (lastPlayType === "HIT") {
        if (battersQueue.length > 0) {
          const nextBatter = battersQueue[0]; // další pálkař na domácí metu
          sendBatterFromOnDeck(nextBatter, "right");
        }

        if (battersQueue.length > 1) {
          const upcomingBatter = battersQueue[1]; // další pálkař do on-deck
          sendBatterFromDugoutToOnDeck(upcomingBatter, "right");
        }
      } 
    }
  }

  requestAnimationFrame(drawRunners);
}

function getBasePosition(baseIndex) {
  if (baseIndex === "HOME") return POS.HOME;
  if (baseIndex === 0) return POS.FIRST;
  if (baseIndex === 1) return POS.SECOND;
  if (baseIndex === 2) return POS.THIRD;
  return POS.HOME;
}

function drawRun(runner, pos) {
  const LEAD_OFFSET = 30;

  let centerX = (runner.x !== undefined) ? runner.x : pos.x + playerSize / 2;
  let centerY = (runner.y !== undefined) ? runner.y : pos.y + playerSize / 2;

  if (runner.x === undefined && pos === POS.FIRST) {
    centerX -= LEAD_OFFSET;
    centerY -= LEAD_OFFSET;
  }
  if (runner.x === undefined && pos === POS.SECOND) {
    centerX -= LEAD_OFFSET + 13;
    centerY += LEAD_OFFSET;
  }
  if (runner.x === undefined && pos === POS.THIRD) {
    centerX += LEAD_OFFSET;
    centerY += LEAD_OFFSET;
  }

  const dx = pos.x - centerX;
  const dy = pos.y - centerY;
  const angle = Math.atan2(dy, dx);

  let imgToDraw = benchPlayerImg;
  if (runner.state === "sliding") imgToDraw = slideImg;
  else if (runner.state === "returning") imgToDraw = bezecImg;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
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
