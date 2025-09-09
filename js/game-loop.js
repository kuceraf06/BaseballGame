function gameLoop() {
  updateSlider();
  updateDugoutRunners();
  updatePitchTypeButtonsPosition();
  draw();
  requestAnimationFrame(gameLoop);
}
