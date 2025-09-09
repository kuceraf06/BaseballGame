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
});

function startPickoff1B() {
  startAnimation();

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

  if (runnerOnFirstBase) {
    moveRunnerBackToBaseAndLead(runnerOnFirstBase, POS.FIRST);
  }

  animateBall(() => {
    resultDisplay.textContent = "SAFE!";
    resultDisplay.style.color = "green";
    ball.owner = "firstBase";
    draw();

    setTimeout(() => {
      returnBallToPitcher();
      endAnimation();
    }, 500);
  });
}

function startPickoff2B() {
  startAnimation();

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

  if (runnerOnSecondBase) {
    moveRunnerBackToBaseAndLead(runnerOnSecondBase, POS.SECOND);
  }

  if (polar) {
    animatePolarToSecond(polar, secondBase, () => {
    });
  }

  animateBall(() => {
    resultDisplay.textContent = "SAFE!";
    resultDisplay.style.color = "green";
    ball.owner = "polar";

    if (polar) {
      setTimeout(() => {
        animatePolarBack(polar);
      }, 500);
    }

    setTimeout(() => {
      returnBallToPitcher();
      endAnimation();
    }, 500);

    draw();
  });
}

function startPickoff3B() {
  startAnimation();

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

  if (runnerOnThirdBase) {
    moveRunnerBackToBaseAndLead(runnerOnThirdBase, POS.THIRD);
  }

  if (polar) {
    animatePolarToThird(polar, thirdBase, () => {
    });
  }

  animateBall(() => {
    resultDisplay.textContent = "SAFE!";
    resultDisplay.style.color = "green";

    if (polar) {
      setTimeout(() => {
        animatePolarBackFromThird(polar);
      }, 500);
    }

    setTimeout(() => {
      returnBallToPitcher();
      endAnimation();
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

function moveRunnerBackToBaseAndLead(runner, basePos) {
  if (!runner) return;

  const BASE = basePos;
  const LEAD_OFFSET = 25;
  const duration = 500;

  const baseCenterX = BASE.x + playerSize / 2;
  const baseCenterY = BASE.y + playerSize / 2;

  let defaultLeadX = baseCenterX;
  let defaultLeadY = baseCenterY;

  if (BASE === POS.FIRST) {
    defaultLeadX -= LEAD_OFFSET;
    defaultLeadY -= LEAD_OFFSET;
  } else if (BASE === POS.SECOND) {
    defaultLeadX -= LEAD_OFFSET;
    defaultLeadY += LEAD_OFFSET;
  } else if (BASE === POS.THIRD) {
    defaultLeadX += LEAD_OFFSET;
    defaultLeadY += LEAD_OFFSET;
  }

  const leadX = (runner.x !== undefined) ? runner.x : defaultLeadX;
  const leadY = (runner.y !== undefined) ? runner.y : defaultLeadY;

  runner.state = "sliding";

  function animateToBase(time, startTime = null) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);

    runner.x = leadX + (baseCenterX - leadX) * progress;
    runner.y = leadY + (baseCenterY - leadY) * progress;

    draw();

    if (progress < 1) {
      requestAnimationFrame(t => animateToBase(t, startTime));
    } else {
      runner.x = baseCenterX;
      runner.y = baseCenterY;
      resultDisplay.textContent = "SAFE!";
      resultDisplay.style.color = "green";
      draw();

      setTimeout(() => {
        runner.state = "returning";
        animateBackToLead(runner, defaultLeadX, defaultLeadY);
      }, 500);
    }
  }

  function animateBackToLead(runner, targetX, targetY) {
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
        if (onComplete) onComplete();
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