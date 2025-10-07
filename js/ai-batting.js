let aiSwingPlanned = false;
function aiDecideSwing() {
  if (!aiBattingEnabled || !ball.active) return;

  let baseReactionTime = 150 + Math.random() * 350; // Základní reactionTime
  let reactionMultiplier = 1; // Multiplikátor pro různé typy nadhozu

  // Upravíme reactionTime podle typu nadhozu
  switch (selectedPitch) {
    case 'FB': // Fastball
      reactionMultiplier = 1; // Žádná změna
      break;
    case 'CH': // Changeup
      reactionMultiplier = 2; // Changeup je pomalejší, AI má více času
      break;
    case 'SL': // Slider
      reactionMultiplier = 1.3; // Slider je mírně pomalejší než fastball
      break;
    default:
      console.warn("Neznámý typ nadhozu, používám výchozí reakční čas.");
  }

  const reactionTime = baseReactionTime * reactionMultiplier;
  aiSwingPlanned = true;

  setTimeout(() => {
    if (!ball.active || !aiSwingPlanned) return;

    const ballInZone =
      hitZone &&
      ball.x >= hitZone.x &&
      ball.x <= hitZone.x + hitZone.width &&
      ball.y >= hitZone.y &&
      ball.y <= hitZone.y + hitZone.height;

    let shouldSwing = false;

    if (ballInZone === true) {
      shouldSwing = Math.random() < 0.65; // strike → 65%
    } else if (ballInZone === false) {
      shouldSwing = Math.random() < 0.30; // ball → 30%
    } else {
      console.warn("Hit zone not defined properly, defaulting ballInZone to false.");
      shouldSwing = false; // Default to no swing
    }
    console.log("Swing Decision: shouldSwing =", shouldSwing, "ballInZone =", ballInZone);

    // === AI švihne ===
    if (shouldSwing) {
      swingActive = true;
      if (!hitRegistered) {
        hitRegistered = true;

        const hitSuccess = ballInZone && Math.random() < 0.25;
        evaluateResult(hitSuccess);
      }
      startSwingAnimation();
    } 
    // === AI nešvihne ===
    else {
      swingActive = false;
      hitRegistered = false;

      // Počkej, až míč dorazí k home plate, pak vyhodnoť ball/strike
      const waitCheck = setInterval(() => {
        if (!ball.active) {
          clearInterval(waitCheck);
          evaluateResult(); // ⚡️automaticky STRIKE nebo BALL
        }
      }, 30);
    }
  }, reactionTime);
}

function aiOnPitchStart() {
  if (!aiBattingEnabled) return;

  aiSwingPlanned = false;
  hitRegistered = false;

  // Inicializace hitZone, pokud ještě není nastavena
  if (!hitZone) {
    hitZone = {
      x: centerX - 12,
      y: homePlateY - 22,
      width: 24,
      height: 24
    };
  }

  const waitForBallActive = setInterval(() => {
    if (ball.active) {
      clearInterval(waitForBallActive);
      console.log("AI On Pitch Start: ball is active");
      setTimeout(aiDecideSwing, 0); // Rozhodnutí AI
    }
  }, 10); // Kontrolovat každých 10 ms
}