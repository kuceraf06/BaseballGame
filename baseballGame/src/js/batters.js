function drawBatters() {
  if (!hideBatterDuringOnDeckAnimation && battersQueue.length > 0) {
    const batterName = battersQueue[0].name;
    const x = centerX - 36;
    const y = homePlateY - 15;

    if (!runScoredText) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(batterName, x + playerSize / 2, y - 5);
    }

    let rotation = 3 * Math.PI / 2;
    if (swingAnimation.active) {
      rotation += swingAnimation.progress * swingAnimation.maxAngle; 
    }

    if (palkarImg && palkarImg.complete) {
      ctx.save();
      ctx.translate(x + playerSize / 2, y + playerSize / 2);
      ctx.rotate(rotation);
      ctx.drawImage(palkarImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
      ctx.restore();
    } else {
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, playerSize, playerSize);
    }
  }
}

let swingAnimation = {
  active: false,
  progress: 0,
  speed: 10,
  maxAngle: Math.PI/2,
  lastTime: 0
};

function triggerSwing() {
  if (!ball.active || hitRegistered) return;

  swingActive = true;

  const ballInZone = (
    ball.x >= hitZone.x &&
    ball.x <= hitZone.x + hitZone.width &&
    ball.y >= hitZone.y &&
    ball.y <= hitZone.y + hitZone.height
  );

  if (ballInZone) {
    hitRegistered = true;
    evaluateResult(true);
  } else {
    hitRegistered = true;
    evaluateResult(false);
  }

  startSwingAnimation();
}

function startSwingAnimation() {
  swingAnimation.active = true;
  swingAnimation.progress = 0;
  swingAnimation.lastTime = performance.now();

  if (swingSound) {
    swingSound.currentTime = 0;
    swingSound.play().catch(() => {});
  }

  requestAnimationFrame(updateSwingAnimation);
}

function updateSwingAnimation(timestamp) {
  if (!swingAnimation.active) return;

  const delta = (timestamp - swingAnimation.lastTime) / 1000;
  swingAnimation.lastTime = timestamp;

  swingAnimation.progress += swingAnimation.speed * delta;
  if (swingAnimation.progress >= 1) {
    swingAnimation.active = false;
    swingAnimation.progress = 0;
  } else {
    requestAnimationFrame(updateSwingAnimation);
  }
}

document.addEventListener('keydown', (e) => {
  // normalize key name so custom binds and variants work
  const keyName = (typeof normalizeKeyName === 'function') ? normalizeKeyName(e.key) : e.key;
  if (keyName === swingKey && !pickoffInProgress && gameState === 'offense' && ball.active) {
    triggerSwing();
  }
});

function handleSwingClick(canvas, e) {
  if (gameState !== 'offense' || !ball.active) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const swingX = 175;
  const swingY = canvas.height - 125;
  const swingRadius = 60;

  const dx = mouseX - swingX;
  const dy = mouseY - swingY;

  if (dx * dx + dy * dy <= swingRadius * swingRadius) {
    triggerSwing();
  }
}

canvas.addEventListener('click', e => handleSwingClick(canvas, e));

function evaluateResult(forceHit) {
  if (resultEvaluated) return;
  resultEvaluated = true;
  
  if (!hitZone) {
    hitZone = {
      x: centerX - 12,
      y: homePlateY - 22,
      width: 24,
      height: 24
    };
  }

  clearTimeout(resultTextTimeout); 

  const isAI = typeof aiBattingEnabled !== 'undefined' && aiBattingEnabled;
  const allowForced = isAI || gameState === 'offense';

  if (swingActive && allowForced) {
    if (forceHit === true) {
      preventReturnToPitcher = true;
      handleHit();
      return;
    } else if (forceHit === false) {
      strikeCount++;

      if (swingAndMissSound) {
        swingAndMissSound.currentTime = 0;
        swingAndMissSound.play().catch(() => {});
      }

      if (strikeCount >= 3) {
        showResultText("SWING & MISS", "red", 1000);
        setTimeout(() => {
          showResultText("STRIKEOUT!", "red");

          if (strikeoutSound) {
            strikeoutSound.currentTime = 0;
            strikeoutSound.play().catch(() => {});
          }

          preventReturnToPitcher = true;
          atBatOver = true;
          strikeOut();
        }, 1000);
      } else {
        showResultText("SWING & MISS", "red");
        setTimeout(() => {
          if (resultText === "SWING & MISS") {
            resultText = "";
          }
        }, 1500);
      }
    }
    return;
  }

  if (!swingActive && ball.y >= homePlateY) {
    if (slider.result === "STRIKE") {

      if (strikeCount < 2) {
        if (strikeSound) {
          strikeSound.currentTime = 0;
          strikeSound.play().catch(() => {});
        }
      }

      showResultText("STRIKE", "green");
      strikeCount++;
      if (strikeCount >= 3) {
        showResultText("STRIKEOUT!", "red");

        if (strikeoutSound) {
          strikeoutSound.currentTime = 0;
          strikeoutSound.play().catch(() => {});
        }

        preventReturnToPitcher = true;
        atBatOver = true;
        strikeOut();
      }
    } else {

    if (ballCount < 3) {
      if (ballSound) {
        ballSound.currentTime = 0;
        ballSound.play().catch(() => {});
      }
    }

      showResultText("BALL!", "red");
      ballCount++;
      if (ballCount >= 4) {
        showResultText("BALL FOUR!", "red");

        if (ballfourSound) {
          ballfourSound.currentTime = 0;
          ballfourSound.play().catch(() => {});
        }

        preventReturnToPitcher = true;
        atBatOver = true;
        ballFour();
      }
    }
  }
}

function flyBall(speed = 0.5, strength) {
  ball.pathType = "flyball";
  ball.progress = 0;
  ball.active = true;

  const peakHeight = 250 * strength;
  let lastTime = performance.now();

  function animate(timestamp) {
    if (!ball.active) return;

    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ball.progress += speed * delta;
    if (ball.progress >= 1) {
      ball.progress = 1;
      ball.x = ball.endX;
      ball.y = ball.endY;
      ball.z = 0;
      ball.active = false; 
    }

    const t = ball.progress;
    ball.x = ball.startX + (ball.endX - ball.startX) * t;
    ball.y = ball.startY + (ball.endY - ball.startY) * t;

    ball.z = peakHeight * Math.sin(t * Math.PI) * (0.8 + 0.2 * t); 

    draw();

    if (ball.progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function groundBall(baseSpeed = 0.5, strength) {
  ball.pathType = "groundball";
  ball.progress = 0;
  ball.active = true;

  const maxBounceHeight = 25 * strength; 
  const totalBounces = 3; 

  const dx = ball.endX - ball.startX;
  const dy = ball.endY - ball.startY;
  const distance = Math.sqrt(dx*dx + dy*dy);

  const slowSpeed = baseSpeed * 0.1 * (200 / distance); 

  let lastTime = performance.now();

  function animate(timestamp) {
    if (!ball.active) return;

    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ball.progress += slowSpeed * delta;
    if (ball.progress >= 1) {
      ball.progress = 1;
      ball.x = ball.endX;
      ball.y = ball.endY;
      ball.z = 0;
      ball.active = false; 
    }

    const t = ball.progress;
    ball.x = ball.startX + dx * t;
    ball.y = ball.startY + dy * t;

    ball.z = Math.abs(Math.sin(t * Math.PI * totalBounces)) * maxBounceHeight * (1 - t);

    draw();

    if (ball.progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function lineDrive(speed = 0.5, strength) {
  ball.pathType = "linedrive";
  ball.progress = 0;
  ball.active = true;

  const initialHeight = strength;
  const tFall = 0.6;

  let lastTime = performance.now();

  function animate(timestamp) {
    if (!ball.active) return;

    const delta = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ball.progress += speed * delta;
    if (ball.progress >= 1) ball.progress = 1;

    const t = ball.progress;

    if (t < tFall) {
      const airT = t / tFall; 
      ball.x = ball.startX + (ball.endX - ball.startX) * t;
      ball.y = ball.startY + (ball.endY - ball.startY) * t;
      ball.z = initialHeight * (1 - airT);
    } else {
      if (!ball.groundStarted) {
        ball.startX = ball.x;
        ball.startY = ball.y;

        const groundSpeed = speed * 0.1;      
        const groundStrength = strength * 0.5; 
        const maxBounceHeight = 25 * groundStrength;
        const totalBounces = 3;

        ball.groundStarted = true;
        ball.progress = 0; 
        let lastGroundTime = performance.now();

        function groundAnimate(timestamp) {
          if (!ball.active) return;

          const deltaG = (timestamp - lastGroundTime) / 1000;
          lastGroundTime = timestamp;

          ball.progress += groundSpeed * deltaG;
          if (ball.progress >= 1) {
            ball.progress = 1;
            ball.x = ball.endX;
            ball.y = ball.endY;
            ball.z = 0;
            ball.active = false; 
          }

          const gt = ball.progress;
          ball.x = ball.startX + (ball.endX - ball.startX) * gt;
          ball.y = ball.startY + (ball.endY - ball.startY) * gt;
          ball.z = Math.abs(Math.sin(gt * Math.PI * totalBounces)) * maxBounceHeight * (1 - gt);

          draw();

          if (ball.progress < 1) {
            requestAnimationFrame(groundAnimate);
          }
        }

        requestAnimationFrame(groundAnimate);
        return;
      }
    }

    draw();
    if (ball.progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function handleHit() { 
  if (!hitRegistered) return;

  const home = { x: centerX, y: homePlateY };
  const foulRadius = 600; 
  const leftAngle = Math.PI * 1.25;
  const rightAngle = Math.PI * 1.75;

  const minStrength = 0.3; 
  const maxStrength = 0.97; 
  const strength = minStrength + Math.random() * (maxStrength - minStrength);

  const angle = Math.random() * (rightAngle - leftAngle) + leftAngle;
  let radius = strength * foulRadius;

  const homerunChance = 0.05;
  const warningTrackRadius = 600;

  if (hitSound) {
    hitSound.currentTime = 0;
    hitSound.play().catch(() => {});
  }

  if (Math.random() < homerunChance) {
    radius = warningTrackRadius + 5 + Math.random() * (70 - 5);
    showResultText("HOMERUN!", "gold", 2000);
    if (homerunSound) { 
      homerunSound.currentTime = 0; 
      homerunSound.play().catch(() => {}); 
    }

    ball.startX = ball.x;
    ball.startY = ball.y;
    ball.endX = home.x + Math.cos(angle) * radius;
    ball.endY = home.y + Math.sin(angle) * radius;

    const speed = 0.002 + (0.004 - 0.002) * strength;
    flyBall(speed, strength);

    const batter = battersQueue.shift();
    if (batter) {
      setTimeout(() => {
        animateHitRunners("HOMERUN", batter);
      }, 1000);
    }

    hitRegistered = true;
    return;
  } else {
    radius = Math.min(radius, warningTrackRadius);
  }

  ball.startX = ball.x;
  ball.startY = ball.y;
  ball.endX = home.x + Math.cos(angle) * radius;
  ball.endY = home.y + Math.sin(angle) * radius;

  const speed = 0.001 + (0.003 - 0.001) * strength;
  ball.strength = strength;

  const rand = Math.random() * 100;
  if (rand < 44) {
    groundBall(speed, strength);
  } else if (rand < 79) {
    flyBall(speed, strength);
  } else {
    lineDrive(speed, strength);
  }

  hitRegistered = true;

  const batter = battersQueue.shift();
  if (batter) {
    const hitType = evaluateHitType(ball);
    setTimeout(() => {
      animateHitRunners(hitType, batter, () => {
        // zvuk se spustí uvnitř callbacku animateHitRunners
        if (hitType === "SINGLE" && singleSound) {
          singleSound.currentTime = 0;
          singleSound.play().catch(() => {});
        } else if (hitType === "DOUBLE" && doubleSound) {
          doubleSound.currentTime = 0;
          doubleSound.play().catch(() => {});
        } else if (hitType === "TRIPLE" && tripleSound) {
          tripleSound.currentTime = 0;
          tripleSound.play().catch(() => {});
        }
      });
    }, 1000);
  }
}

function evaluateHitType(ball) {
  let hitType = "SINGLE";

  const doubleMin = 450;
  const doubleMax = 549;
  const tripleMin = 550;
  const tripleMax = 599;

  const distance = Math.hypot(ball.endX - ball.startX, ball.endY - ball.startY);
  const pathType = ball.pathType;

  if (pathType === "flyball" || pathType === "linedrive" || pathType === "groundball") {
    if (distance >= tripleMin && distance <= tripleMax) {
      hitType = "TRIPLE";
    } else if (distance >= doubleMin && distance <= doubleMax) {
      hitType = "DOUBLE";
    } else {
      hitType = "SINGLE";
    }
  }

  return hitType;
}