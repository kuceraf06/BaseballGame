let runnerOnFirstBase = null;
let ballCountInProgress = false;
let runnerOnSecondBase = null;
let runnerOnThirdBase = null;
let bases = [null, null, null];

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
let preventReturnToPitcher = false;

let gameState = 'defense';
let aiBattingEnabled = (gameState === 'defense'); 
let outs = 0;
let strikeCount = 0;
let ballCount = 0;

let hitRegistered = false;
let swingAllowed = false;
let strikeoutInProgress = false;
let swingActive = false;
let atBatOver = false;
let showHitZone = true;
let hitZone = null;
let lastPlayType = null; 

let selectedPitch = 'FB';
let lastPitch = null;
const pitchNames = {
  'FB': 'Fastball',
  'SL': 'Slider',
  'CH': 'Changeup'
};

let resultText = '';
let resultTextColor = 'black';
let resultTextTimeout;

const stateIndicatorEl = document.getElementById('stateIndicator');
const outsDisplayEl = document.getElementById('outsDisplay');
const toggleStateBtn = document.getElementById('toggleStateBtn');
const pitchTypeContainerEl = document.getElementById('pitchTypeContainer');
const pickoffButtons = document.querySelectorAll('.pickoffBtn');
const throwButtonEl = document.getElementById('throwButton');

function drawResultText() {
  if (resultText) {
    ctx.font = 'bold 38px sans-serif';
    ctx.fillStyle = resultTextColor;
    ctx.textAlign = 'center';
    ctx.fillText(resultText, centerX, homePlateY - 250);
  }
}

function showResultText(text, color = 'yellow', duration = 1500) {
  resultText = text;
  resultTextColor = color;

  clearTimeout(resultTextTimeout);
  resultTextTimeout = setTimeout(() => {
    resultText = '';
  }, duration);
}

function updateStateUI() {
  if (!stateIndicatorEl) return;
  if (gameState === 'defense') {
    if (pitchTypeContainerEl) pitchTypeContainerEl.style.display = 'block';
    pickoffButtons.forEach(b => b.style.display = 'inline-block');
    throwButtonEl.textContent = 'Ready (Pitch)';
  } else {
    if (pitchTypeContainerEl) pitchTypeContainerEl.style.display = 'none';
    pickoffButtons.forEach(b => b.style.display = 'none');
    throwButtonEl.textContent = 'Ready (Batting)';
  }
}

function addOut() {
  outs++;

  if (outs >= 3) {
    setTimeout(() => {
      switchSides();
    }, 800);
  }
}

function switchSides() {
  outs = 0;
  gameState = (gameState === 'defense') ? 'offense' : 'defense';

  aiBattingEnabled = (gameState === 'defense');

  resetCount();
  updateStateUI();
  draw();
}

if (toggleStateBtn) {
  toggleStateBtn.addEventListener('click', () => {
    switchSides();
  });
}

updateStateUI();
