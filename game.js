import { resetBricks, drawBricks, bricksArray, levels } from "./levelEditor.js";
import { updateScoreboard, startTimer, timerId } from "./scoreboard.js";
import { loseLife, brickHit, paddleHit } from "./audio.js";
import { menuState } from "./menu.js";
import { view, STATES } from "./view.js";
import { keyDownHandler, keyUpHandler, keyPressed, movePaddle } from "./controls.js";

// GAME DEFINITION CONSTANTS
const brickHeight = 35;
const gameWidth = 800;
const gameHeight = 600;

// DOM ELEMENTS
export const paddleElem = document.querySelector(".paddle");
export const ballElem = document.querySelector(".ball");
export const levelText = document.querySelector(".level-text");

// OVERLAY VARIABLES
export const overlay = document.querySelector(".overlay");
const overlayText = document.getElementById("overlay-text");


// PADDLE OBJECT
export let Paddle = {
  Width: 100,
  Height: 30,
  Speed: 4,
  X: (gameWidth - 100) / 2,
}

// BALL
export let Ball = {
  X: Paddle.X + Paddle.Width / 2,
  Y: gameHeight - Paddle.Height - brickHeight,
  Speed: 3,
  Direction: { x: 0, y: -1 }
}

// GAME STATES
export let gameState = {
  Started: false,
  Paused: false,
  Over: false,
  Story: false,
  firstTime: true,
}

// PLAYER OBJECT
export let player = {
  name: "",
  level: 1,
  points: 0,
  time: 0,
  lives: 3,
  brickAmount: 1
}

export function resetGame() {
  Object.assign(player, { points: 0, lives: 3, level: 1, time: 0, brickAmount: levels[player.level - 1].totalBricks });
  Object.assign(gameState, {Started: false, Paused: false, Over: false, Story: false});
  Object.assign(Ball, {X: Paddle.X + Paddle.Width / 2, Y: gameHeight - Paddle.Height - brickHeight});
  resetBricks();
  drawBricks(player.level - 1);
  overlayText.textContent = "Press space";
  document.getElementById("timer").textContent = "TIME: 0";
}



// UPDATES BALL POSITION
function moveBall() {
  if (!gameState.Started) {
    Object.assign(Ball, {X: Paddle.X + Paddle.Width / 2, Y: gameHeight - Paddle.Height - brickHeight});
  }
  if (gameState.Started) {
    Ball.X += Ball.Direction.x * Ball.Speed;
    Ball.Y += Ball.Direction.y * Ball.Speed;
  }
  ballElem.style.left = Ball.X + "px";
  ballElem.style.top = Ball.Y + "px";
}

// CHECKS FOR COLLISION. ADJUST TO TASTE.
function checkCollision() {
  // Calculate the coordinates of the edges of the ball and the paddle
  const ballLeft = Ball.X, ballRight = Ball.X + ballElem.offsetWidth, ballTop = Ball.Y, ballBottom = Ball.Y + ballElem.offsetHeight;
  const paddleLeft = Paddle.X, paddleRight = Paddle.X + paddleElem.offsetWidth, paddleTop = gameHeight - paddleElem.offsetHeight - 10, paddleBottom = gameHeight;

  // Checks if ball hits walls.
  if (ballTop <= 0) Ball.Direction.y *= -1;
  if (ballLeft <= 0) Ball.X = 1, Ball.Direction.x *= -1;
  if (ballRight >= gameWidth) Ball.X = gameWidth - 21, Ball.Direction.x *= -1;
  if (ballBottom >= gameHeight) {
    player.lives--;
    Object.assign(Ball, {X: Paddle.X + Paddle.Width / 2, Y: gameHeight - Paddle.Height - brickHeight});
    gameState.Started = false;
    if (player.lives <= 0) finishGame('dead');
    if (player.lives > 0) loseLife.play(); stopGame();
    return;
  }
  let xDir = -1, division = 2 / Paddle.Width;

  // Check if the edges of the ball and the paddle overlap
  if (
    ballRight >= paddleLeft &&
    ballLeft <= paddleRight &&
    ballBottom >= paddleTop &&
    ballTop <= paddleBottom
  ) {
    paddleHit.play();
    xDir += division * (Ball.X - Paddle.X)
    Ball.Direction.x = xDir;
    Ball.Direction.y = -1; // If there is a collision, change direction of ball.
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
        Ball.Direction.x *= -1;
      } else {
        Ball.Direction.y *= -1;
      }
      brickHit.play();
      player.brickAmount--;
      brick.remove();
      bricksArray.splice(i, 1);
      player.points += 10;
      Ball.Speed += 0.03;
    }
  }
}

function stopGame() {
  clearInterval(timerId);
  overlayText.textContent = "Press space to start";
  overlay.style.display = "block";
}

export function pauseGame() {
  if (!gameState.Paused && !gameState.Over) {
    clearInterval(timerId);
    gameState.Paused = true;
    overlayText.textContent = "Press 'R' to restart";
    overlay.style.display = "block";
  } else {
    gameState.Paused = false;
    overlay.style.display = "none";
    startTimer();
  }
}

function checkForWin() {
  if (gameState.Story) return;
  if (player.brickAmount <= 0) {
    clearInterval(timerId);
    if (player.level == 3) {
      finishGame('end');
    }
    if (player.level < 3) {
      player.level++;
      initiateLevel();
    }
    gameState.Started = false;
  }
}

function gameLoop() {
  if (!gameState.Paused) {
    checkCollision();
    movePaddle();
    moveBall();
    updateScoreboard();
    checkForWin();
  }
  requestAnimationFrame(gameLoop);
}

function finishGame(event) {
  let gameOverMsg;
  document.querySelector(".scoreboard").style.display = "none";
  document.querySelector(".game-area").style.display = "none";
  switch(event){
    case 'end':
      gameOverMsg = player.time < 300 ? "You Win!" : "You Lose!";
      break;
    case 'dead':
      gameOverMsg = "You died! No more grit:lab :-(";
  }
  document.getElementById("finish-game-details").textContent = gameOverMsg;
  view(STATES.GAME_OVER);
  menuState.outsideMenu = false;
}

// function submitScore(event) {
//   event.preventDefault();
//   const playerName = event.target.form.elements[0].value;
//   player.name = playerName;
//   const playerData = {
//     name: playerName,
//     level: player.level,
//     points: player.points,
//     time: player.time,
//     lives: player.lives
//   };
//   console.log(JSON.stringify(playerData));
//   fetch('http://localhost:5502/api/data', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(playerData)
//   })
//     .then(response => response.json())
//     .then(leaderboard => {
//       const leaderboardDiv = player.win ? document.getElementById("leaderboard-win") : document.getElementById("leaderboard-lose");
//       leaderboardDiv.innerHTML = "";
//       leaderboard.forEach(entry => {
//         const entryDiv = document.createElement("div");
//         entryDiv.classList.add("leaderboard-entry");
//         entryDiv.innerHTML = `<span class="rank">${entry.rank}</span><span class="name">${entry.name}</span><span class="score">${entry.score}</span><span class="time">${entry.time}</span>`;
//         leaderboardDiv.appendChild(entryDiv);
//       });
//     })
//     .catch(error => console.error('Error submitting player data:', error));
//   player.win = false;
// }

export function initiateLevel() {
  gameState.Story = true;
  const currentLevel = player.level - 1; // array is 0-indexed

  // display level text
  levelText.innerHTML = levels[currentLevel].text;
  levelText.style.display = "flex";
  Paddle.Speed = 4;
  Ball.Speed = 3;
  // draw bricks for current level
  resetBricks();
  drawBricks(currentLevel);

  // set bricks needed to pass the level
  player.brickAmount = levels[currentLevel].totalBricks;

  // set paddle position and width
  Paddle.X = (gameWidth - Paddle.Width) / 2;
  Paddle.Width = 100;

  // set initial ball position and start game loop
  Object.assign(Ball, {X: Paddle.X + Paddle.Width / 2, Y: gameHeight - Paddle.Height - brickHeight});
  if (gameState.firstTime) gameLoop();
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);
