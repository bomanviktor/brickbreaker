import { resetBricks, drawBricks, bricksArray, levels } from "./levelEditor.js";
import { updateScoreboard, startTimer, timerId } from "./scoreboard.js";
import { loseLife, brickHit, paddleHit } from "./audio.js";
import { menuState } from "./menu.js";

// GAME DEFINITION CONSTANTS
const brickHeight = 35;
const gameWidth = 800;
const gameHeight = 600;
const paddleWidth = 100;
const paddleHeight = 30;
const paddle = document.querySelector(".paddle");
const ball = document.querySelector(".ball");
const levelText = document.querySelector(".level-text");

// PADDLE CONTROLS
let paddleSpeed = 4;
let paddleX = (gameWidth - paddleWidth) / 2;
let leftKeyPressed = false;
let rightKeyPressed = false;
let shiftPressed = false;

// BALL MOVEMENT SETTINGS 
let ballX = paddleX + paddleWidth / 2;
let ballY = gameHeight - paddleHeight - brickHeight;
let ballSpeed = 3;
let ballDirection = { x: 0, y: -1 };

// GAME STARTED/PAUSED/GAMEOVER/INSIDE STORY TEXT
let gameStarted = false;
let paused = false;
let gameOver = false;
export let insideStory = false;
let firstTime = true;
// OVERLAY VARIABLES
const overlay = document.querySelector(".overlay");
const overlayText = document.getElementById("overlay-text");

// PLAYER OBJECT
export let player = {
  name: "",
  level: 1,
  points: 0,
  time: 0,
  lives: 3,
  win: false
}

let brickAmount;

// MOVES THE PADDLE
function movePaddle() {
  paddleSpeed = shiftPressed ? 8 : 4;
  paddleX += (rightKeyPressed - leftKeyPressed) * paddleSpeed;
  paddleX = Math.min(Math.max(paddleX, 0), gameWidth - paddleWidth);
  paddle.style.left = paddleX + "px";
}

export function resetGame() {
  Object.assign(player, { points: 0, lives: 3, level: 1, time: 0 });
  [ballX, ballY] = [(paddleX + paddleWidth / 2) - 10, gameHeight - paddleHeight - brickHeight];
  [gameStarted, paused, gameOver, brickAmount] = [false, false, false, levels[player.level - 1].totalBricks];
  resetBricks();
  drawBricks(player.level - 1);
  overlayText.textContent = "Press space";
  document.getElementById("timer").textContent = "TIME: 0";
}

// HANDLES ALL KEYDOWN PRESSES. ENABLES RESTART LEVEL IF GAME IS PAUSED.
function keyDownHandler(event) {
  switch (event.key) {
    case "ArrowLeft":
      leftKeyPressed = true;
      break;
    case "ArrowRight":
      rightKeyPressed = true;
      break;
    case "Shift":
      shiftPressed = true;
      break;
    case " ":
      if (!gameStarted && !insideStory) {
        gameStarted = true;
        startTimer();
        overlay.style.display = "none";
        ballDirection.y = -1;
        ballDirection.x = Math.random() / 2 - 0.5;
      }
      if (insideStory) {
        insideStory = false;
        levelText.style.display = "none";
        overlay.style.display = "block";
      }
      break;
    case "p":
      gameStarted && pauseGame();
      break;
    case "r":
      if (gameStarted && paused && !insideStory) {
        resetGame();
      }
      gameOver && resetGame();
      break;
    case "t":
      brickAmount = 0;
      break;
  }
}

// KEYUP HANDLER
function keyUpHandler(event) {
  switch (event.key) {
    case "ArrowLeft":
      leftKeyPressed = false;
      break;
    case "ArrowRight":
      rightKeyPressed = false;
      break;
    case "Shift":
      shiftPressed = false;
      break;
  }
}

// UPDATES BALL POSITION
function moveBall() {
  if (!gameStarted) {
    [ballX, ballY] = [(paddleX + paddleWidth / 2) - 10, gameHeight - paddleHeight - brickHeight];
  }
  if (gameStarted) {
    ballX += ballDirection.x * ballSpeed;
    ballY += ballDirection.y * ballSpeed;
  }
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

// CHECKS FOR COLLISION. ADJUST TO TASTE.
function checkCollision() {
  // Calculate the coordinates of the edges of the ball and the paddle
  const ballLeft = ballX, ballRight = ballX + ball.offsetWidth, ballTop = ballY, ballBottom = ballY + ball.offsetHeight;
  const paddleLeft = paddleX, paddleRight = paddleX + paddle.offsetWidth, paddleTop = gameHeight - paddle.offsetHeight - 10, paddleBottom = gameHeight;

  // Checks if ball hits walls.
  if (ballTop <= 0) ballDirection.y *= -1;
  if (ballLeft <= 0) ballX = 1, ballDirection.x *= -1;
  if (ballRight >= gameWidth) ballX = gameWidth - 21, ballDirection.x *= -1;
  if (ballBottom >= gameHeight) {
    player.lives--;
    [ballX, ballY] = [(paddleX + paddleWidth / 2) - 10, gameHeight - paddleHeight - brickHeight];
    gameStarted = false;
    if (player.lives <= 0) finishGame('');
    if (player.lives > 0) loseLife.play(); stopGame();
    return;
  }
  let xDir = -1, division = 2 / paddleWidth;

  // Check if the edges of the ball and the paddle overlap
  if (
    ballRight >= paddleLeft &&
    ballLeft <= paddleRight &&
    ballBottom >= paddleTop &&
    ballTop <= paddleBottom
  ) {
    paddleHit.play();
    xDir += division * (ballX - paddleX)
    ballDirection.x = xDir;
    ballDirection.y = -1; // If there is a collision, change direction of ball.
  }

  // Loop through each brick and check for collision
  for (let i = 0; i < bricksArray.length; i++) {
    const brick = bricksArray[i];
    const brickLeft = brick.offsetLeft;
    const brickRight = brick.offsetLeft + brick.offsetWidth;
    const brickTop = brick.offsetTop;
    const brickBottom = brick.offsetTop + brick.offsetHeight;

    // signals a hit with a brick xD
    if (
      ballRight >= brickLeft &&
      ballLeft <= brickRight &&
      ballBottom >= brickTop &&
      ballTop <= brickBottom
    ) {
      if (
        ballLeft <= brickLeft - 16 ||
        ballRight >= brickRight + 16
      ) {
        ballDirection.x *= -1;
      } else {
        ballDirection.y *= -1;
      }
      brickHit.play();
      brickAmount--;
      brick.remove();
      bricksArray.splice(i, 1);
      player.points += 10;
      ballSpeed += 0.03;
    }
  }
}

function stopGame() {
  clearInterval(timerId);
  overlayText.textContent = "Press space to start";
  overlay.style.display = "block";
}

function pauseGame() {
  if (!paused && !gameOver) {
    clearInterval(timerId);
    paused = true;
    overlayText.textContent = "Press 'R' to restart";
    overlay.style.display = "block";
  } else {
    paused = false;
    overlay.style.display = "none";
    startTimer();
  }
}

function checkForWin() {
  if (insideStory) return;
  if (brickAmount <= 0) {
    clearInterval(timerId);
    if (player.level == 3) {
      finishGame('Win');
    }
    if (player.level < 3) {
      player.level++;
      firstTime = false;
      initiateLevel();
    }
    gameStarted = false;
  }
}

function gameLoop() {
  if (!paused) {
    checkCollision();
    movePaddle();
    moveBall();
    updateScoreboard();
    checkForWin();
  }
  requestAnimationFrame(gameLoop);
}

function finishGame(win) {
  document.querySelector(".scoreboard").style.display = "none";
  document.querySelector(".game-area").style.display = "none";
  if (win) {
    player.win = true;
    document.getElementById("finish-game").style.display = "flex";
    document.getElementById('playerNameWin').focus();
    document.getElementById("submit-win").addEventListener("click", submitScore);
  } else {
    document.getElementById("lose-game").style.display = "flex";
    document.getElementById('playerNameLose').focus();
    document.getElementById("submit-lose").addEventListener("click", submitScore);
  }
  menuState.outsideMain = false;
}

function submitScore(event) {
  event.preventDefault();
  const playerName = event.target.form.elements[0].value;
  player.name = playerName;
  const playerData = {
    name: playerName,
    level: player.level,
    points: player.points,
    time: player.time,
    lives: player.lives
  };
  console.log(JSON.stringify(playerData));
  fetch('http://localhost:5502/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playerData)
  })
    .then(response => response.json())
    .then(leaderboard => {
      const leaderboardDiv = player.win ? document.getElementById("leaderboard-win") : document.getElementById("leaderboard-lose");
      leaderboardDiv.innerHTML = "";
      leaderboard.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.classList.add("leaderboard-entry");
        entryDiv.innerHTML = `<span class="rank">${entry.rank}</span><span class="name">${entry.name}</span><span class="score">${entry.score}</span><span class="time">${entry.time}</span>`;
        leaderboardDiv.appendChild(entryDiv);
      });
    })
    .catch(error => console.error('Error submitting player data:', error));
  player.win = false;
}

export function initiateLevel() {
  insideStory = true;
  const currentLevel = player.level - 1; // array is 0-indexed

  // display level text
  levelText.innerHTML = levels[currentLevel].text;
  levelText.style.display = "flex";
  paddleSpeed = 4;
  ballSpeed = 3;
  // draw bricks for current level
  resetBricks();
  drawBricks(currentLevel);

  // set bricks needed to pass the level
  brickAmount = levels[currentLevel].totalBricks;

  // set paddle position
  paddleX = (gameWidth - paddleWidth) / 2;

  // set initial ball position and start game loop
  [ballX, ballY] = [(paddleX + paddleWidth / 2) - 10, gameHeight - paddleHeight - brickHeight];
  if (firstTime) gameLoop();
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);
