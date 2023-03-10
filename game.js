import { resetBricks, drawBricks, bricksArray, levels} from "./levelEditor.js";


const brickWidth = 75;
const brickHeight = 35;

// GAME DEFINITION CONSTANTS
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
let ballY = gameHeight - paddleHeight - 35;
let ballSpeed = 3;
let ballDirection = { x: 0, y: -1 };

// GAME STARTED/PAUSED/GAMEOVER/INSIDE STORY TEXT
let gameStarted = false;
let paused = false;
let gameOver = false;
let insideStory;
let firstTime = true;
// OVERLAY VARIABLES
const overlay = document.querySelector(".overlay");
const overlayText = document.getElementById("overlay-text");

// PLAYER OBJECT
let player = {
  level: 1,
  points: 0,
  time: 0,
  lives: 3
}

let brickAmount;

// MOVES THE PADDLE
function movePaddle() {
  if(shiftPressed){
    paddleSpeed = 8;
  } else {
    paddleSpeed = 4;
  }
  if (leftKeyPressed && !rightKeyPressed) {
    paddleX -= paddleSpeed;
  } else if (rightKeyPressed && !leftKeyPressed) {
    paddleX += paddleSpeed;
  }
  if (paddleX < 0) {
    paddleX = 0;
  } else if (paddleX > gameWidth - paddleWidth) {
    paddleX = gameWidth - paddleWidth;
  }
  drawPaddle();
}

function resetGame() {
  Object.assign(player, { points: 0, lives: 3, level: 1, time: 0 });
  [ballX, ballY] = [(paddleX + paddleWidth / 2) - 10, gameHeight - paddleHeight - 35];
  [gameStarted, paused, gameOver, brickAmount] = [false, false, false, 10];
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
        if(!gameStarted && !insideStory){
            gameStarted = true;
            startTimer();
            overlay.style.display = "none";
            ballDirection.y = -1;
            ballDirection.x = Math.random()/2 - 0.5;
        }
        if(insideStory){
          insideStory = false;
          levelText.style.display = "none";
          overlay.style.display = "block";

        }
        break;
    case "p":
        if(gameStarted){
            pauseGame();
        }
        break;
    case "r":
      if(gameStarted && paused && !insideStory){
        resetGame();
      }
      if (gameOver){
        resetGame();
      }
      break;
    case "t":
      console.log(brickAmount);
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

// DRAWS THE PADDLE
function drawPaddle() {
  paddle.style.left = paddleX + "px";
}

// DRAWS THE BALL
function drawBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
  if (!gameStarted) {
    ballX = (paddleX + paddleWidth / 2) - 10;
    ballY = gameHeight - paddleHeight - 35;
  }
}

// UPDATES BALL POSITION
function updateBallPosition() {
  if (gameStarted) {
    ballX += ballDirection.x * ballSpeed;
    ballY += ballDirection.y * ballSpeed;
  }
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
      ballX = (paddleX + paddleWidth / 2) - 10;
      ballY = gameHeight - paddleHeight - 35;
      gameStarted = false;
      if (player.lives <= 0) {
        overlayText.textContent = "Game over! Press 'R' to restart";
        overlay.style.display = "block";
        gameOver = true;
        clearInterval(timerId);
      } else {
        stopGame();
      }
      return;
    }
    let xDir = -1, division = 2 / paddleWidth;
    // Check if the edges of the ball and the paddle overlap
    if (
      ballRight >= paddleLeft &&
      ballLeft <= paddleRight &&
      ballBottom >= paddleTop  &&
      ballTop <= paddleBottom
    ) {
      xDir += division * (ballX - paddleX)
      ballDirection.x = xDir;
      ballDirection.y = -1;
      // If there is a collision, change direction of ball.
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
      brickAmount--;
      brick.remove();
      bricksArray.splice(i, 1);
      player.points += 10;
      ballSpeed += 0.03;
      break;
    }
  }
}

function updateScoreboard(){
    document.getElementById("level").innerText = "LEVEL: " + player.level;
    document.getElementById("lives").innerText = "LIVES: " + player.lives;
    document.getElementById("score").innerText = "SCORE: " + player.points;
}


// Update the timer every second
let timerId;
function startTimer() {
    timerId = setInterval(function() {
      player.time++;
      document.getElementById("timer").textContent = "TIME: " + player.time;
    }, 1000);
  }
  
  function stopGame() {
    // Stop the timer
    clearInterval(timerId);
    // rest of your code...
    overlayText.textContent = "Press space to start";
    overlay.style.display = "block";
  }

function pauseGame(){
    if (!paused && !gameOver){
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

function checkForWin(){
  if (insideStory) return;
  if (brickAmount <= 0){
    clearInterval(timerId);
    if(player.level > 3){
      overlayText.textContent = `You win! Score: ${player.points} Press "r" to play again.`;
      overlay.style.display = "block";
    } 
    if(player.level <= 3) {
      player.level++;
      firstTime = false;
      initiateLevel();
    }
    gameStarted = false;
    gameOver = true;
  }
}




function gameLoop() {
    if(!paused){
        checkCollision();
        movePaddle();
        drawPaddle();
        updateBallPosition();
        drawBall();
        updateScoreboard();
        checkForWin();
    }
    requestAnimationFrame(gameLoop);
}

export function initiateLevel(){
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

  // set initial ball position and start game loop
  ballX = (paddleX + paddleWidth / 2) - 10;
  ballY = gameHeight - paddleHeight - 35;
  if (firstTime) gameLoop();
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);
