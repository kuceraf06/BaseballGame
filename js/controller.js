function drawController(ctx, canvas) {
    if (gameState !== 'defense') return;
    
    const size = 60;
    const centerX = canvas.width - 150;
    const centerY = canvas.height - 150;
  
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "16px Arial";

    function drawBase(x, y, label) {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  
      ctx.fillStyle = "white";
      ctx.fillText(label, x, y);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
    }
  
    const spacing = size * 1.1;
    drawBase(centerX, centerY - spacing, "2B");
    drawBase(centerX + spacing, centerY, "1B");
    drawBase(centerX, centerY + spacing, "HOME");
    drawBase(centerX - spacing, centerY, "3B");
  
    ctx.restore();
  }
  