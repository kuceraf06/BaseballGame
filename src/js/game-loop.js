function gameLoop(now) {
  updateSlider(now);
  updateDugoutRunners();
  updatePitchTypeButtonsPosition();
  draw();
  requestAnimationFrame(gameLoop);
}
