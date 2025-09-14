function drawBatters() {
  if (!hideBatterDuringOnDeckAnimation && battersQueue.length > 0) {
    const batterName = battersQueue[0].name;
    const x = centerX - 33;
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

let swingActive = false;

let swingAnimation = {
  active: false,
  progress: 0,
  speed: 0.05,
  maxAngle: Math.PI/2 
};

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !pickoffInProgress && gameState === 'offense' && ball.active) {
    swingActive = true;
    checkSwing();
    startSwingAnimation();
  }
});

function checkSwing() {
    swingActive = true;
}

function startSwingAnimation() {
  swingAnimation.active = true;
  swingAnimation.progress = 0;
  requestAnimationFrame(updateSwingAnimation);
}

function updateSwingAnimation() {
  if (!swingAnimation.active) return;

  swingAnimation.progress += swingAnimation.speed;
  if (swingAnimation.progress >= 1) {
    swingAnimation.active = false;
    swingAnimation.progress = 0;
  } else {
    requestAnimationFrame(updateSwingAnimation);
  }
}

