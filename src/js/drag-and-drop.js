let draggingPlayer = null;
let offsetX = 0;
let offsetY = 0;

function isInsidePlayer(player, mx, my) {
  return mx >= player.x && mx <= player.x + playerSize &&
         my >= player.y && my <= player.y + playerSize;
}

canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = players.length - 1; i >= 0; i--) {
    if (players[i].name.startsWith('Polar') && isInsidePlayer(players[i], mouseX, mouseY)) {
      draggingPlayer = players[i];
      offsetX = mouseX - draggingPlayer.x;
      offsetY = mouseY - draggingPlayer.y;
      break;
    }
  }
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (!draggingPlayer) {
    let hoveringPolar = false;
    for (let i = players.length - 1; i >= 0; i--) {
      if (players[i].name.startsWith('Polar') && isInsidePlayer(players[i], mouseX, mouseY)) {
        hoveringPolar = true;
        break;
      }
    }
    canvas.style.cursor = hoveringPolar ? 'pointer' : 'default';
  } else {
    canvas.style.cursor = 'grabbing';

    let newX = mouseX - offsetX;
    let newY = mouseY - offsetY;

    const homeX = centerX;
    const homeY = homePlateY;

    const dx = newX + playerSize / 2 - homeX;
    const dy = newY + playerSize / 2 - homeY;
    const angle = Math.atan2(dy, dx);

    const distance = Math.sqrt(dx * dx + dy * dy);

    const foulLeftAngle = Math.PI * 1.25;
    const foulRightAngle = Math.PI * 1.75;

    const maxDistance = 600 - playerSize;

    let normalizedAngle = angle;
    if (angle < -Math.PI) normalizedAngle += 2 * Math.PI;
    if (angle > Math.PI) normalizedAngle -= 2 * Math.PI;

    const withinFoulLines =
      normalizedAngle >= -Math.PI * 0.75 && normalizedAngle <= -Math.PI * 0.25;

    const withinHomerunZone = distance <= maxDistance;

    if (withinFoulLines && withinHomerunZone) {
      draggingPlayer.x = newX;
      draggingPlayer.y = newY;
      draw();
    }
  }
});

canvas.addEventListener('mouseup', e => {
  draggingPlayer = null;
});

canvas.addEventListener('mouseleave', e => {
  draggingPlayer = null;
});