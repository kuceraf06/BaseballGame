function drawDiamond() {
  const home = { x: centerX, y: homePlateY };
  const first = { x: home.x + baseDistance, y: home.y - baseDistance };
  const second = { x: home.x, y: home.y - baseDistance * 2 };
  const third = { x: home.x - baseDistance, y: home.y - baseDistance };

  ctx.beginPath();
  ctx.moveTo(home.x, home.y);
  ctx.lineTo(first.x, first.y);
  ctx.lineTo(second.x, second.y);
  ctx.lineTo(third.x, third.y);
  ctx.closePath();
  ctx.fillStyle = '#ffcc80';
  ctx.fill();
  ctx.stroke();

  const baseSize = 17;
  [first, second, third].forEach(base => {
    ctx.save();
    ctx.translate(base.x, base.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'white';
    ctx.fillRect(-baseSize / 2, -baseSize / 2, baseSize, baseSize);
    ctx.restore();
  });

  drawHomePlate(home.x, home.y, baseSize);

  ctx.beginPath();
  ctx.arc(centerX, home.y - baseDistance, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#a1887f';
  ctx.fill();

  const moundX = centerX - 7.5;
  const moundY = home.y - baseDistance - 2.5;
  const moundWidth = 15;
  const moundHeight = 3.5;

  ctx.fillStyle = 'white';
  ctx.fillRect(moundX, moundY, moundWidth, moundHeight);
  ctx.strokeRect(moundX, moundY, moundWidth, moundHeight);
}

function drawHomePlate(x, y, size) {
  const half = size / 2;
  const height = size * 0.7;

  ctx.beginPath();
  ctx.moveTo(x - half, y - height);
  ctx.lineTo(x + half, y - height);
  ctx.lineTo(x + half, y);
  ctx.lineTo(x, y + height / 2);
  ctx.lineTo(x - half, y);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.stroke();
}

function drawHitZone() {
  if (gameState !== 'offense' || !showHitZone || aiBattingEnabled) return;

  const zoneWidth = 20;
  const zoneHeight = 20;
  const x = centerX - zoneWidth / 2;
  const y = homePlateY - zoneHeight + 2;

  hitZone = { x, y, width: zoneWidth, height: zoneHeight };

  ctx.beginPath();
  ctx.rect(x, y, zoneWidth, zoneHeight);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,0,0,0.2)';
  ctx.fill();
}

function drawFoulLines() {
  const home = { x: centerX, y: homePlateY };
  const foulRadius = 600;
  const leftAngle = Math.PI * 1.25;
  const rightAngle = Math.PI * 1.75;

  const leftFoulX = home.x + Math.cos(leftAngle) * foulRadius;
  const leftFoulY = home.y + Math.sin(leftAngle) * foulRadius;

  const rightFoulX = home.x + Math.cos(rightAngle) * foulRadius;
  const rightFoulY = home.y + Math.sin(rightAngle) * foulRadius;

  ctx.beginPath();
  ctx.moveTo(home.x, home.y);
  ctx.lineTo(leftFoulX, leftFoulY);
  ctx.moveTo(home.x, home.y);
  ctx.lineTo(rightFoulX, rightFoulY);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawOutfield() {
  const home = { x: centerX, y: homePlateY };
  ctx.beginPath();
  ctx.moveTo(home.x, home.y);
  ctx.arc(home.x, home.y, 600, -Math.PI * 0.25, -Math.PI * 0.75, true);
  ctx.closePath();
  ctx.fillStyle = '#66bb6a';
  ctx.fill();
  ctx.stroke();
}

function drawWarningTrack() {
  const home = { x: centerX, y: homePlateY };
  const outerRadius = 600;
  const trackWidth = 15;

  ctx.beginPath();
  ctx.arc(home.x, home.y, outerRadius, -Math.PI * 0.25, -Math.PI * 0.75, true);
  ctx.arc(home.x, home.y, outerRadius - trackWidth, -Math.PI * 0.75, -Math.PI * 0.25, false);
  ctx.closePath();
  ctx.fillStyle = '#ffcc80';
  ctx.fill();
}

/*function drawTabula() {
  const home = { x: centerX, y: homePlateY };
  const plotRadius = 400;
  const tabulaDepth = 10;
  const tabulaWidth = 110;
  const tabulaHeight = 80;
  const angle = -Math.PI / 2;

  const tabulaX = home.x + Math.cos(angle) * (plotRadius + tabulaDepth);
  const tabulaY = home.y + Math.sin(angle) * (plotRadius + tabulaDepth);

  ctx.save();
  ctx.translate(tabulaX, tabulaY);

  ctx.strokeStyle = '#555a5f';
  ctx.lineWidth = 6;
  const poleHeight = 11;
  const poleOffsetX = tabulaWidth / 2 - 20;

  ctx.beginPath();
  ctx.moveTo(-poleOffsetX, 0);
  ctx.lineTo(-poleOffsetX, poleHeight);
  ctx.moveTo(poleOffsetX, 0);
  ctx.lineTo(poleOffsetX, poleHeight);
  ctx.stroke();

  const grad = ctx.createLinearGradient(-tabulaWidth/2, -tabulaHeight, tabulaWidth/2, 0);
  grad.addColorStop(0, '#d0d4d8');
  grad.addColorStop(0.5, '#8c8f92');
  grad.addColorStop(1, '#d0d4d8');

  ctx.fillStyle = grad;
  ctx.fillRect(-tabulaWidth / 2, -tabulaHeight, tabulaWidth, tabulaHeight);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.moveTo(-tabulaWidth / 2, -tabulaHeight);
  ctx.lineTo(-tabulaWidth / 2 + 30, -tabulaHeight);
  ctx.lineTo(tabulaWidth / 2, 0);
  ctx.lineTo(tabulaWidth / 2 - 30, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#666a6f';
  ctx.lineWidth = 2;
  ctx.strokeRect(-tabulaWidth / 2, -tabulaHeight, tabulaWidth, tabulaHeight);

  ctx.fillStyle = '#222';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCOREBOARD', 0, -tabulaHeight + 8);

  const team1 = 'Tým A';
  const team2 = 'Tým B';
  const score1 = 3;
  const score2 = teamBScore;

  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(team1, -tabulaWidth / 2 + 10, -tabulaHeight / 2);
  ctx.fillText(score1.toString(), -tabulaWidth / 2 + 25, -tabulaHeight / 2 + 16);

  ctx.textAlign = 'right';
  ctx.fillText(team2, tabulaWidth / 2 - 10, -tabulaHeight / 2);
  ctx.fillText(score2.toString(), -tabulaWidth / 2 - 25 + tabulaWidth, -tabulaHeight / 2 + 16);

  ctx.restore();
}*/

function drawBattersBoxes() {
  const boxWidth = 20;
  const boxHeight = 50;
  const spacing = 9;

  ctx.beginPath();
  ctx.rect(centerX - boxWidth - spacing, homePlateY - boxHeight / 2.5, boxWidth, boxHeight);
  ctx.fillStyle = '#ffcc80';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(centerX + spacing, homePlateY - boxHeight / 2.5, boxWidth, boxHeight);
  ctx.fillStyle = '#ffcc80';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawCatcherBox() {
  const boxWidth = 17;
  const boxHeight = 30;
  const boxX = centerX - boxWidth / 2;
  const boxY = homePlateY + 0;

  ctx.beginPath();
  ctx.rect(boxX, boxY, boxWidth, boxHeight);
  ctx.fillStyle = '#ffcc80';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawDugouts() {
  const dugoutWidth = 100;
  const dugoutHeight = 40;
  const roofHeight = 6;
  const benchHeight = 8;
  const poleWidth = 4;
  const offset = 100;

  const home = { x: centerX, y: homePlateY };

  function drawSingleDugout(baseX, baseY, angle, flip = false) {
    ctx.save();
    ctx.translate(baseX, baseY);
    ctx.rotate(angle + (flip ? Math.PI : 0));

    ctx.fillStyle = '#FFEA00';
    ctx.fillRect(-5, -roofHeight, dugoutWidth + 10, roofHeight);

    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(0, 0, dugoutWidth, dugoutHeight - roofHeight);

    ctx.fillStyle = '#212121';
    ctx.fillRect(2, 0, poleWidth, dugoutHeight - roofHeight);
    ctx.fillRect(dugoutWidth - 4, 0, poleWidth, dugoutHeight - roofHeight);

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(5, dugoutHeight - benchHeight - roofHeight - 1, dugoutWidth - 10, benchHeight);

    if (benchPlayerImg.complete) {
      const playerCount = 9;
      const spacing = (dugoutWidth - 15) / playerCount;

      for (let i = 0; i < playerCount; i++) {
        const x = 5 + i * spacing;
        const y = dugoutHeight - 26;
        const w = 15;
        const h = 20;

        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(benchPlayerImg, -w / 2, -h / 2, w, h);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  const angleLeft = Math.PI * 1.25;
  const leftX = home.x + Math.cos(angleLeft) * 3 * offset;
  const leftY = home.y + Math.sin(angleLeft) * 1.5 * offset;
  drawSingleDugout(leftX, leftY, angleLeft, true);

  const angleRight = Math.PI * 1.75;
  const rightX = home.x + Math.cos(angleRight) * 2 * offset;
  const rightY = home.y + Math.sin(angleRight) * 0.5 * offset;
  drawSingleDugout(rightX, rightY, angleRight);
      
  dugoutLeftPos = { x: leftX, y: leftY };
  dugoutRightPos = { x: rightX, y: rightY };
}

function drawOnDeckCircle() {
  const radius = 13;
  const offsetX = 90;
  const offsetY = 5;
      
  const leftX = centerX - offsetX;
  const rightX = centerX + offsetX;
  const circleY = homePlateY - offsetY;

  ctx.beginPath();
  ctx.arc(leftX, circleY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'transparent';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(rightX, circleY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'transparent';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.stroke();

  if (!hideOnDeckDuringAnimation && currentOnDeckBatter) {
    if (currentOnDeckBatter.img && currentOnDeckBatter.img.complete) {
      ctx.drawImage(
        currentOnDeckBatter.img,
        rightX - playerSize / 2,
        circleY - playerSize / 2 - 5,
        playerSize,
        playerSize
      );

      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(currentOnDeckBatter.name, rightX, circleY - radius - 5);
    }
  }
}

function drawField() {
  drawOutfield();
  drawWarningTrack();
  drawFoulLines();
  //drawTabula();
  drawBattersBoxes(); 
  drawCatcherBox(); 
  drawDiamond();
  drawHitZone();
  drawDugouts();
  drawOnDeckCircle();
}