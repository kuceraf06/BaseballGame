const stealBtn2B = document.getElementById('stealButton2B');
if (stealBtn2B) {
  stealBtn2B.addEventListener('click', () => {
    if (gameState === 'offense' && bases[0]) { // Máme běžce na 1B
      stealAttemptActive = !stealAttemptActive;
      stealRunner = stealAttemptActive ? bases[0] : null;
      stealBtn2B.classList.toggle('activeSteal', stealAttemptActive);
    }
  });
}

function animateRunnerSteal(runner, fromBaseIndex, onComplete) {
  startAnimation();
  runnersInMotion = true;

  // Zajistí postup běžce o jednu metu (1B → 2B = index 0→1)
  const animations = [{
    from: fromBaseIndex,
    to: fromBaseIndex + 1,
    player: runner,
    steal: true // Příznak pro případné další využití v animaci
  }];

  // Aktualizuj stav met v poli bases
  bases[fromBaseIndex] = null;
  bases[fromBaseIndex + 1] = runner;

  runAnimations(animations, () => {
    runnersInMotion = false;
    draw();
    if (onComplete) onComplete();
    endAnimation();
  });
}