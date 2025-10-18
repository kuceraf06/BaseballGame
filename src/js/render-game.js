function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawField();
  drawBall();
  drawSlider();
  drawResultText(); 
  drawScoreboard(ctx);

  const animatedRunners = window.currentAnimatedRunners || [];

  [0, 1, 2].forEach(i => {
    const runner = bases[i];
    if (runner && !animatedRunners.includes(runner)) {
      const pos = i === 0 ? POS.FIRST : i === 1 ? POS.SECOND : POS.THIRD;
      drawRun(runner, pos);
    }
  });

  const pickoffBtn1B = document.getElementById("pickoffButton");
  if (bases[0]) {
    pickoffBtn1B.style.display = "inline-block";
    pickoffBtn1B.style.left = (POS.FIRST.x - 20) + "px";
    pickoffBtn1B.style.top  = (POS.FIRST.y + 5) + "px";
  } else {
    pickoffBtn1B.style.display = "none";
  }

  const pickoffBtn2B = document.getElementById("pickoffButton2B");
  if (bases[1]) {
    pickoffBtn2B.style.display = "inline-block";
    pickoffBtn2B.style.left = (POS.SECOND.x) + "px";
    pickoffBtn2B.style.top  = (POS.SECOND.y + 10) + "px";
  } else {
    pickoffBtn2B.style.display = "none";
  }

  const pickoffBtn3B = document.getElementById("pickoffButton3B");
  if (bases[2]) {
    pickoffBtn3B.style.display = "inline-block";
    pickoffBtn3B.style.left = (POS.THIRD.x) + "px";
    pickoffBtn3B.style.top  = (POS.THIRD.y + 10) + "px";
  } else {
    pickoffBtn3B.style.display = "none";
  }

  drawDugoutRunners();

  players.forEach(p => {
      if (p.name === 'Palkar') {
        if (hideBatterDuringOnDeckAnimation) return;
      }

    let drawX = p.x;
    let drawY = p.y;

    if (p.name === 'Polar_FirstBase' && bases[0]) {
      drawX = POS.FIRST.x - 15; 
      drawY = POS.FIRST.y - 5; 
    }

    if (p.name === 'Polar_FirstBase' && runnersInStealing) {
      drawX = POS.FIRST.x - 15;
      drawY = POS.FIRST.y - 5;
    } 

    if (p.name === 'Catcher' && p.moving) {
      const speed = 2;
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist > 1) {
        p.x += (dx / dist) * speed;
        p.y += (dy / dist) * speed;
        drawX = p.x;
        drawY = p.y;
      } else {
        p.moving = false;
        drawX = p.x;
        drawY = p.y;
      }
    }

    if (p.img.complete) {
      ctx.save();
      const centerXimg = drawX + playerSize / 2;
      const centerYimg = drawY + playerSize / 2;
      ctx.translate(centerXimg, centerYimg);

      if (p.name === 'Polar_SecondBase') {
        if (p.state === "runningToBase") {
          ctx.rotate(Math.PI);
        } else if (p.state === "returning") {
          ctx.rotate(Math.PI / 4);
        } else {
          ctx.rotate(0);
        }
      } else if (p.name === 'Catcher') {
        ctx.rotate(Math.PI / 1);
      } else if (p.name === 'Nadhazovac') {
        ctx.rotate(Math.PI / 2);
      } else {
        ctx.rotate(0);
      }

      ctx.drawImage(p.img, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
      ctx.restore();
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(drawX, drawY, playerSize, playerSize);
    }
  });

  drawBatters();
  drawController(ctx, canvas);

  if (typeof updateStealButtons === 'function') {
    updateStealButtons();
  }
}

let loadedCount = 0;
const images = [catcherImg, nadhazovacImg, palkarImg, polarImg, bezecImg, ballImg];
images.forEach(img => {
  img.onload = () => {
    loadedCount++;
    if (loadedCount === images.length) {
      draw();
      gameLoop();
    }
  }
});