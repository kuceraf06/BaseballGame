document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('field');
  const ctx = canvas.getContext('2d');

  const windowModeBtn = document.getElementById('windowModeBtn');
  const fullscreenModeBtn = document.getElementById('fullscreenModeBtn');

  // --- Původní rozměry ---
  const originalWidth = 800;
  const originalHeight = 600;

  // --- Stále uchováváme měřítko ---
  let scaleX = 1;
  let scaleY = 1;

  function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
    scaleX = width / originalWidth;
    scaleY = height / originalHeight;
    drawEverything(); // překreslíme hrací plochu s novým měřítkem
  }

  windowModeBtn.addEventListener('click', () => {
    canvas.classList.remove('fullscreenCanvas');
    resizeCanvas(originalWidth, originalHeight);
  });

  fullscreenModeBtn.addEventListener('click', () => {
    canvas.classList.add('fullscreenCanvas');
    resizeCanvas(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('resize', () => {
    if (canvas.classList.contains('fullscreenCanvas')) {
      resizeCanvas(window.innerWidth, window.innerHeight);
    }
  });

  window.scaleCoordX = x => x * scaleX;
  window.scaleCoordY = y => y * scaleY;
  window.scaleSize = size => Math.max(size * scaleX, size * scaleY); // pro hrace, základy

  function drawEverything() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // zde zavoláme všechny funkce z field.js
    drawField();
  }

  // inicialně kreslíme ve window módu
  drawEverything();
});
