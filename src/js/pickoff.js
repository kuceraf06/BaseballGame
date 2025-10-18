let pickoffAttempt1B = false;
let pickoffAttempt2B = false;
let pickoffAttempt3B = false;

const pickoffBtn1B = document.getElementById("pickoffButton");
const pickoffBtn2B = document.getElementById("pickoffButton2B");
const pickoffBtn3B = document.getElementById("pickoffButton3B");

function hidePickoffButtons() {
  pickoffBtn1B.classList.add('hidden');
  pickoffBtn2B.classList.add('hidden');
  pickoffBtn3B.classList.add('hidden');
}

function showPickoffButtons() {
  pickoffBtn1B.classList.remove('hidden');
  pickoffBtn2B.classList.remove('hidden');
  pickoffBtn3B.classList.remove('hidden');
}

pickoffBtn1B.addEventListener("click", () => {
  pickoffAttempt1B = !pickoffAttempt1B;
  pickoffBtn1B.classList.toggle("active-pickoff", pickoffAttempt1B);

  pickoffAttempt2B = false;
  pickoffBtn2B.classList.remove("active-pickoff");
  
  pickoffAttempt3B = false;
  pickoffBtn3B.classList.remove("active-pickoff");
});

pickoffBtn2B.addEventListener("click", () => {
  pickoffAttempt2B = !pickoffAttempt2B;
  pickoffBtn2B.classList.toggle("active-pickoff", pickoffAttempt2B);

  pickoffAttempt1B = false;
  pickoffBtn1B.classList.remove("active-pickoff");

  pickoffAttempt3B = false;
  pickoffBtn3B.classList.remove("active-pickoff");
});

pickoffBtn3B.addEventListener("click", () => {
  pickoffAttempt3B = !pickoffAttempt3B;
  pickoffBtn3B.classList.toggle("active-pickoff", pickoffAttempt3B);

  pickoffAttempt1B = false;
  pickoffBtn1B.classList.remove("active-pickoff");

  pickoffAttempt2B = false;
  pickoffBtn2B.classList.remove("active-pickoff");
});

throwButton.addEventListener('click', () => {
  if (animationInProgress) return; 
  throwButton.blur();

  if (gameState === 'defense') {
    if (pickoffAttempt1B) {
      startAnimation();
      startPickoff1B(() => endAnimation());
      pickoffAttempt1B = false;
      pickoffBtn1B.classList.remove("active-pickoff");

    } else if (pickoffAttempt2B) {
      startAnimation();
      startPickoff2B(() => endAnimation());
      pickoffAttempt2B = false;
      pickoffBtn2B.classList.remove("active-pickoff");

    } else if (pickoffAttempt3B) {
      startAnimation();
      startPickoff3B(() => endAnimation());
      pickoffAttempt3B = false;
      pickoffBtn3B.classList.remove("active-pickoff");

    } else {
      startPitch();
    }
  } 
  else if (gameState === 'offense') {
    setTimeout(aiPitch, 600 + Math.random() * 750);
  }
});

function startPickoff1B() {
  pickoffInProgress = true; 
  startAnimation();

  setTimeout(() => aiSteal(true), 50);

  const pitcher = players.find(p => p.name === "Nadhazovac");
  const firstBase = POS.FIRST;

  const baseCenterX = firstBase.x + playerSize / 2;
  const baseCenterY = firstBase.y + playerSize / 2;

  ball.startX = pitcher.x + playerSize / 2;
  ball.startY = pitcher.y + playerSize / 2;
  ball.endX = baseCenterX;
  ball.endY = baseCenterY;
  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  draw();

  if (bases[0]) {
    moveRunnerBackToBaseAndLead(bases[0], POS.FIRST);
  }

  animateBall(() => {
    showResultText("SAFE!", "green");
    ball.owner = "firstBase";
    draw();

    setTimeout(() => {
      if (!runnersInStealing) {
        returnBallToPitcher();
      }
      endAnimation();
      pickoffInProgress = false;
    }, 500);
  });
}

function startPickoff2B() {
  pickoffInProgress = true; 
  startAnimation();

  setTimeout(() => aiSteal(true), 50);

  const pitcher = players.find(p => p.name === "Nadhazovac");
  const secondBase = POS.SECOND;
  const polar = players.find(p => p.name === "Polar_SecondBase");

  if (polar) {
    polar.originalX = polar.x;
    polar.originalY = polar.y;
    polar.defaultImg = polar.img; 
  }

  const baseCenterX = secondBase.x + playerSize / 2;
  const baseCenterY = secondBase.y + playerSize / 2;

  ball.startX = pitcher.x + playerSize / 2;
  ball.startY = pitcher.y + playerSize / 2;
  ball.endX = baseCenterX;
  ball.endY = baseCenterY;
  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  draw();

  if (bases[1]) {
    moveRunnerBackToBaseAndLead(bases[1], POS.SECOND);
  }

  if (polar) {
    animatePolarToSecond(polar, secondBase, () => {
    });
  }

  animateBall(() => {
   showResultText("SAFE!", "green");
    ball.owner = "polar";

    if (polar) {
      setTimeout(() => {
        animatePolarBack(polar);
      }, 500);
    }

    setTimeout(() => {
      if (!runnersInStealing) {
        returnBallToPitcher();
      }
      endAnimation();
      pickoffInProgress = false;
    }, 500);

    draw();
  });
}

function startPickoff3B() {
  pickoffInProgress = true; 
  startAnimation();

  setTimeout(() => aiSteal(true), 50);

  const pitcher = players.find(p => p.name === "Nadhazovac");
  const thirdBase = POS.THIRD;
  const polar = players.find(p => p.name === "Polar_ThirdBase");

  if (polar) {
    polar.originalX = polar.x;
    polar.originalY = polar.y;
    polar.defaultImg = polar.img; 
  }

  const baseCenterX = thirdBase.x + playerSize / 2;
  const baseCenterY = thirdBase.y + playerSize / 2;

  ball.startX = pitcher.x + playerSize / 2;
  ball.startY = pitcher.y + playerSize / 2;
  ball.endX = baseCenterX;
  ball.endY = baseCenterY;
  ball.x = ball.startX;
  ball.y = ball.startY;
  ball.progress = 0;
  ball.active = true;

  draw();

  if (bases[2]) {
    moveRunnerBackToBaseAndLead(bases[2], POS.THIRD);
  }

  if (polar) {
    animatePolarToThird(polar, thirdBase, () => {
    });
  }

  animateBall(() => {
    showResultText("SAFE!", "green");

    if (polar) {
      setTimeout(() => {
        animatePolarBackFromThird(polar);
      }, 500);
    }

    setTimeout(() => {
      ball.owner = "thirdBase";
      returnBallToPitcher();
      endAnimation();
      pickoffInProgress = false;
    }, 500);

    draw();
  });
}

function animatePolarToSecond(polar, base, onComplete) {
  const startX = polar.x;
  const startY = polar.y;
  const targetX = base.x + 5;
  const targetY = base.y - 5;
  const duration = 500;

  polar.img = actionImg;
  polar.state = "runningToBase";

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    polar.x = startX + (targetX - startX) * progress;
    polar.y = startY + (targetY - startY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      polar.img = polar.defaultImg;
      polar.state = "tagging";
      draw();

      if (typeof onComplete === "function") onComplete();
    }
  }

  requestAnimationFrame(animate);
}

function animatePolarBack(polar) {
  if (runnersInStealing) {
    polar.waitToReturn = true;
    return;
  }

  const startX = polar.x;
  const startY = polar.y;
  const targetX = polar.originalX;
  const targetY = polar.originalY;
  const duration = 500;

  polar.img = actionImg;

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    polar.x = startX + (targetX - startX) * progress;
    polar.y = startY + (targetY - startY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      polar.img = polar.defaultImg;
      draw();
      polar.waitToReturn = false;
    }
  }

  requestAnimationFrame(animate);
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

  let angle = 0;
  if (runner.state === "sliding") {
    const dx = pos.x + playerSize / 2 - centerX;
    const dy = pos.y + playerSize / 2 - centerY;
    angle = Math.atan2(dy, dx);
  } else if (runner.state === "returning") {
    if (pos === POS.FIRST) angle = -Math.PI / 4;
    else if (pos === POS.SECOND) angle = Math.PI / 4;
    else if (pos === POS.THIRD) angle = (3 * Math.PI) / 4;
  } else {
    angle = 0;
  }

  let imgToDraw = bezecImg;
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

function moveRunnerBackToBaseAndLead(runner, basePos, onComplete) {
  if (!runner) return;

  const BASE = basePos;
  const LEAD_OFFSET = 25;
  const duration = 500;

  const baseCenterX = BASE.x + playerSize / 2;
  const baseCenterY = BASE.y + playerSize / 2;

  let leadX = baseCenterX;
  let leadY = baseCenterY;
  if (BASE === POS.FIRST) { leadX -= LEAD_OFFSET; leadY -= LEAD_OFFSET; }
  else if (BASE === POS.SECOND) { leadX -= LEAD_OFFSET; leadY += LEAD_OFFSET; }
  else if (BASE === POS.THIRD) { leadX += LEAD_OFFSET; leadY += LEAD_OFFSET; }

  const startX = (runner.x !== undefined) ? runner.x : leadX;
  const startY = (runner.y !== undefined) ? runner.y : leadY;

  runner.state = "sliding";

  if (slideSound) {
    slideSound.currentTime = 0;
    slideSound.play().catch(() => {});
  }

  function animateToBase(time, startTime = null) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    runner.x = startX + (baseCenterX - startX) * progress;
    runner.y = startY + (baseCenterY - startY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(t => animateToBase(t, startTime));
    } else {
      runner.x = baseCenterX;
      runner.y = baseCenterY;
      showResultText("SAFE!", "green");

      setTimeout(() => {
        runner.state = "returning";
        animateBackToLead(runner, leadX, leadY, onComplete);
      }, 500);
    }
  }

  function animateBackToLead(runner, targetX, targetY, callback) {
    const startX = runner.x;
    const startY = runner.y;
    const startTime = performance.now();

    function animate(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      runner.x = startX + (targetX - startX) * progress;
      runner.y = startY + (targetY - startY) * progress;

      draw();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        runner.x = undefined;
        runner.y = undefined;
        runner.state = "lead";
        draw();
        if (typeof callback === "function") callback();
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animateToBase);
}

function animatePolarToThird(polar, base, onComplete) {
  const startX = polar.x;
  const startY = polar.y;
  const targetX = base.x - 10;
  const targetY = base.y - 5;
  const duration = 500;

  polar.img = actionImg;
  polar.state = "runningToBase";

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    polar.x = startX + (targetX - startX) * progress;
    polar.y = startY + (targetY - startY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      polar.img = polar.defaultImg;
      polar.state = "tagging";
      draw();

      if (typeof onComplete === "function") onComplete();
    }
  }

  requestAnimationFrame(animate);
}

function animatePolarBackFromThird(polar) {
  const startX = polar.x;
  const startY = polar.y;
  const targetX = polar.originalX;
  const targetY = polar.originalY;
  const duration = 500;

  polar.img = actionImg;

  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    polar.x = startX + (targetX - startX) * progress;
    polar.y = startY + (targetY - startY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      polar.img = polar.defaultImg;
      draw();
    }
  }

  requestAnimationFrame(animate);
}