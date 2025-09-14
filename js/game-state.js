let runnerOnFirstBase = null;
let ballCountInProgress = false;
let runnerOnSecondBase = null;
let runnerOnThirdBase = null;

let hideOnDeckDuringAnimation = false;
let currentOnDeckBatter = battersQueue[1];

let teamBScore = 0;
let runScoredText = '';
let runScoredTimeout = null;
let hideBatterDuringOnDeckAnimation = false;
let runnersInMotion = false;

let dugoutLeftPos = null;
let dugoutRightPos = null;

let dugoutRunners = [];

let batterRunningToDugout = false;
let batterRunObj = null;

let pickoffInProgress = false;
let endOfAtBat = false;

let gameState = 'defense';
let outs = 0;

const stateIndicatorEl = document.getElementById('stateIndicator');
const outsDisplayEl = document.getElementById('outsDisplay');
const toggleStateBtn = document.getElementById('toggleStateBtn');
const pitchTypeContainerEl = document.getElementById('pitchTypeContainer');
const pickoffButtons = document.querySelectorAll('.pickoffBtn');
const throwButtonEl = document.getElementById('throwButton');

function updateStateUI() {
  if (!stateIndicatorEl) return;
  if (gameState === 'defense') {
    stateIndicatorEl.textContent = 'DEFENSE — You pitch';
    stateIndicatorEl.style.background = '#1976d2';
    stateIndicatorEl.style.color = 'white';
    if (pitchTypeContainerEl) pitchTypeContainerEl.style.display = 'block';
    pickoffButtons.forEach(b => b.style.display = 'inline-block');
    throwButtonEl.textContent = 'Ready (Pitch)';
  } else {
    stateIndicatorEl.textContent = 'OFFENSE — You bat';
    stateIndicatorEl.style.background = '#f57c00';
    stateIndicatorEl.style.color = 'white';
    if (pitchTypeContainerEl) pitchTypeContainerEl.style.display = 'none';
    pickoffButtons.forEach(b => b.style.display = 'none');
    throwButtonEl.textContent = 'Ready (Batting)';
  }
}

function updateOutDisplay() {
  if (!outsDisplayEl) return;
  outsDisplayEl.textContent = `Outs: ${outs}`;
}

function addOut() {
  outs++;
  updateOutDisplay();
  resultDisplay.textContent = `OUT! (${outs}/3)`;
  resultDisplay.style.color = 'red';

  if (outs >= 3) {
    setTimeout(() => {
      switchSides();
    }, 800);
  }
}

function switchSides() {
  outs = 0;
  updateOutDisplay();

  gameState = (gameState === 'defense') ? 'offense' : 'defense';
  resetCount();

  updateStateUI();
  draw();
}

if (toggleStateBtn) {
  toggleStateBtn.addEventListener('click', () => {
    switchSides();
  });
}

updateOutDisplay();
updateStateUI();
