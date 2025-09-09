const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');
const resultDisplay = document.getElementById('result');
const throwButton = document.getElementById('throwButton');

const centerX = canvas.width / 2;
const homePlateY = canvas.height - 50;
const baseDistance = 120;
const playerSize = 20;

const catcherImg = new Image();
const nadhazovacImg = new Image();
const palkarImg = new Image();
const polarImg = new Image();
const bezecImg = new Image();
const ballImg = new Image();
const batterDugoutImg = new Image();
const benchPlayerImg = new Image();
const slideImg = new Image();
const actionImg = new Image();

catcherImg.src = 'images/catcher.png';
nadhazovacImg.src = 'images/nadhazovac.png';
palkarImg.src = 'images/palkar.png';
polarImg.src = 'images/polar.png';
bezecImg.src = 'images/bezec.png';
ballImg.src = 'images/baseball.png';
batterDugoutImg.src = 'images/batterDugout.png';
benchPlayerImg.src = 'images/benchPlayer.png';
slideImg.src = 'images/slide.png';
actionImg.src = 'images/akce.png';

let battersQueue = [
  { name: 'Palkar1', img: palkarImg },
  { name: 'Palkar2', img: palkarImg },
  { name: 'Palkar3', img: palkarImg },
  { name: 'Palkar4', img: palkarImg },
  { name: 'Palkar5', img: palkarImg }
];

let animationInProgress = false;

function startAnimation() {
  animationInProgress = true;
  throwButton.disabled = true;
  hidePickoffButtons();
  throwButton.classList.add("disabled");
}

function endAnimation() {
  animationInProgress = false;
  throwButton.disabled = false;
  showPickoffButtons();
  pitchTypeContainer.style.display = 'flex';
  throwButton.classList.remove("disabled");
}

function nextBatter() {
  const batter = battersQueue.shift();
  battersQueue.push(batter);
  return batter;
}

const players = [
  { name: 'Catcher', img: catcherImg, x: centerX - 10, y: homePlateY + 7 },
  { name: 'Nadhazovac', img: nadhazovacImg, x: centerX - 5, y: homePlateY - baseDistance - 5 },

  { name: 'Polar_LeftField', img: polarImg, x: centerX - 170, y: homePlateY - 300 },
  { name: 'Polar_CenterField', img: polarImg, x: centerX - 20,  y: homePlateY - 350 },
  { name: 'Polar_RightField', img: polarImg, x: centerX + 130, y: homePlateY - 300 },

  { name: 'Polar_SecondBase', img: polarImg, x: centerX + baseDistance / 4, y: homePlateY - baseDistance - 120},
  { name: 'Polar_ShortStop', img: polarImg, x: centerX - baseDistance / 2, y: homePlateY - baseDistance * 2 },

  { name: 'Polar_ThirdBase', img: polarImg, x: centerX - baseDistance - 0, y: homePlateY - baseDistance - 50 },
  { name: 'Polar_FirstBase', img: polarImg, x: centerX + baseDistance - 30, y: homePlateY - baseDistance - 50 }
];

const catcher = players.find(p => p.name === 'Catcher');
catcher.homeX = catcher.x;
catcher.homeY = catcher.y;
catcher.moving = false;

const POS = {
  FIRST: { x: centerX + baseDistance - playerSize / 2, y: homePlateY - baseDistance - playerSize / 2 },
  SECOND: { x: centerX - playerSize / 2, y: homePlateY - baseDistance * 2 - playerSize / 2 },
  THIRD: { x: centerX - baseDistance - playerSize / 2, y: homePlateY - baseDistance - playerSize / 2 },
  HOME: { x: centerX, y: homePlateY },
};

function getBatterPositions() {
  return [
    {
      ...battersQueue[0],
      x: centerX - 37,
      y: homePlateY - 15
    },
    {
      ...battersQueue[1],
      x: centerX + 90 - playerSize/2,
      y: homePlateY - 5 - playerSize/2
    }
  ];
}