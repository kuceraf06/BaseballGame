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