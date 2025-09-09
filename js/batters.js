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

    if (palkarImg && palkarImg.complete) {
      ctx.save();
      ctx.translate(x + playerSize / 2, y + playerSize / 2);
      ctx.rotate(3 * Math.PI / 2);
      ctx.drawImage(palkarImg, -playerSize / 2, -playerSize / 2, playerSize, playerSize);
      ctx.restore();
    } else {
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, playerSize, playerSize);
    }
  }
}