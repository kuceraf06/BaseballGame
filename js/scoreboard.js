function drawScoreboard(ctx) {
    const canvasWidth = ctx.canvas.width;
    const sbWidth = 310;
    const sbHeight = 80;
    const sbX = canvasWidth - sbWidth - 20;
    const sbY = 20;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(sbX, sbY, sbWidth, sbHeight);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(sbX, sbY, sbWidth, sbHeight);

    const padding = 8;
    const colWidths = [
        50,
        30,
        30,
        sbWidth - (50 + 30 + 30) - 2 * padding
    ];

    let colsX = [];
    let currentX = sbX + padding;
    for (let w of colWidths) {
        colsX.push(currentX);
        currentX += w;
    }

    const colCenters = colWidths.map((w, i) => colsX[i] + w / 2);
    const rowMid = sbY + sbHeight / 2;

    ctx.fillStyle = 'white';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const teamTextOffset = 3;

    ctx.fillText('HOM', colCenters[0] - teamTextOffset, sbY + sbHeight / 4);
    ctx.fillText(`${teamBScore}`, colCenters[1], sbY + sbHeight / 4);

    const arrowX = colCenters[2];
    const arrowY = sbY + sbHeight / 4 - 2;
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, arrowY + 6);
    ctx.lineTo(arrowX + 6, arrowY + 6);
    ctx.lineTo(arrowX, arrowY - 4);
    ctx.closePath();
    if (gameState === 'defense') {
        ctx.fillStyle = 'white';
        ctx.fill();
    } else {
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const leftOff = 9;
    ctx.fillText(`${ballCount} - ${strikeCount}`, colsX[3] + leftOff, sbY + sbHeight / 4);

    function drawBase(centerX, centerY, size, occupied) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size / 2);
        ctx.lineTo(centerX + size / 2, centerY);
        ctx.lineTo(centerX, centerY + size / 2);
        ctx.lineTo(centerX - size / 2, centerY);
        ctx.closePath();

        if (occupied) {
            ctx.fillStyle = 'white';
            ctx.fill();
        } else {
            ctx.fillStyle = 'transparent';
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    const baseSize = 17;
    const baseCenterX = colsX[3] + colWidths[3] - 30;
    const baseCenterY = sbY + sbHeight / 3.25;
    const gap = 2;

    drawBase(baseCenterX, baseCenterY - baseSize / 2 - gap, baseSize, runnerOnSecondBase);
    drawBase(baseCenterX + baseSize / 2 + gap, baseCenterY, baseSize, runnerOnFirstBase);
    drawBase(baseCenterX - baseSize / 2 - gap, baseCenterY, baseSize, runnerOnThirdBase);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('AWA', colCenters[0] - teamTextOffset, sbY + 3 * sbHeight / 4);
    ctx.fillText('3', colCenters[1], sbY + 3 * sbHeight / 4);

    ctx.fillStyle = 'white';
    const arrowY2 = sbY + 3 * sbHeight / 4 + 2;
    ctx.beginPath();
    ctx.moveTo(arrowX - 6, arrowY2 - 6);
    ctx.lineTo(arrowX + 6, arrowY2 - 6);
    ctx.lineTo(arrowX, arrowY2 + 4);
    ctx.closePath();
    if (gameState === 'offense') {
        ctx.fillStyle = 'white';
        ctx.fill();
    } else {
        ctx.fillStyle = 'transparent';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    const topArrowY = sbY + sbHeight / 4;
    const bottomArrowY = sbY + 3 * sbHeight / 4;
    const inningY = (topArrowY + bottomArrowY) / 2;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('1', arrowX, inningY);

    const outsX = colsX[3];
    const pitchX = colsX[3] + colWidths[3];
    const centerY = sbY + 3 * sbHeight / 4;

    const outCount = outs;
    const dotSize = 12;
    const dotSpacing = 6;
    const leftOffset = 15;
    const outStartX = colsX[3] + leftOffset;
    const outY = sbY + 3 * sbHeight / 4;

    for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.arc(outStartX + i * (dotSize + dotSpacing), outY, dotSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        if (i < outCount) {
            ctx.fillStyle = '#f00';
            ctx.fill();
        }
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    const pitchLabel = lastPitch ? pitchNames[lastPitch] : "";
    const rightOffset = 5;
    ctx.fillText(`${pitchLabel}`, pitchX - rightOffset, centerY);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(sbX, rowMid);
    ctx.lineTo(colsX[2], rowMid);
    ctx.moveTo(colsX[2] + colWidths[2], rowMid);
    ctx.lineTo(sbX + sbWidth, rowMid);
    ctx.stroke();

    for (let i = 1; i < colsX.length; i++) {
        ctx.beginPath();
        ctx.moveTo(colsX[i], sbY);
        ctx.lineTo(colsX[i], sbY + sbHeight);
        ctx.stroke();
    }
}
