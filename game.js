import { resetBricks, drawBricks, bricks} from "./levelEditor.js";


const brickWidth = 75;
const brickHeight = 35;

// GAME DEFINITION CONSTANTS
const gameWidth = 800; 
const gameHeight = 600;
const paddleWidth = 100;
const paddleHeight = 30;
const paddle = document.querySelector(".paddle");
const ball = document.querySelector(".ball");

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

// GAME STARTED/PAUSED/GAMEOVER
let gameStarted = false;
let paused = false;
let gameOver = false;

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

let brickAmount = 10;

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

function resetGame(){
  player.points = 0;
  player.lives = 3;
  player.level = 1;
  player.time = 0;
  ballX = (paddleX + paddleWidth / 2) - 10;
  ballY = gameHeight - paddleHeight - 35;
  gameStarted = false;
  paused = false;
  gameOver = false;
  brickAmount = 10;
  resetBricks();
  drawBricks(player.level);
  overlayText.textContent = "Press space";
  document.getElementById("timer").textContent = "TIME: 0";
}


// HANDLES ALL KEYDOWN PRESSES. ENABLES RESTART LEVEL IF GAME IS PAUSED.
function keyDownHandler(event) {
  console.log(event);
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
        if(!gameStarted){
            gameStarted = true;
            startTimer();
            overlay.style.display = "none";
            ballDirection.y = -1;
            ballDirection.x = Math.random()/2 - 0.5;
        }
        break;
    case "p":
        if(gameStarted){
            pauseGame();
        }
        break;
    case "r":
      if(gameStarted && paused){
        resetGame();
      }
      if (gameOver){
        resetGame();
      }
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
    const ballLeft = ballX;                       // Literally ball left position
    const ballRight = ballX + ball.offsetWidth;   // and right position
    const ballTop = ballY;                        // and top position
    const ballBottom = ballY + ball.offsetHeight; // and bottom position

    // same as above.
    const paddleLeft = paddleX;
    const paddleRight = paddleX + paddle.offsetWidth;
    const paddleTop = gameHeight - paddle.offsetHeight - 10;
    const paddleBottom = gameHeight;

    // Checks if ball hits walls.
    if (ballTop <= 0){
        ballDirection.y *= -1; 
    }
    if (ballLeft <= 0){
        ballX = 1;
        ballDirection.x *= -1;
    }
    if (ballRight >= gameWidth){
      ballX = gameWidth - 21;
      ballDirection.x *= -1;
    }

    // Checks if ball hits bottom. Player then loses a life. If life == 0, game over screen.
    if (ballBottom >= gameHeight){
        player.lives--;
        ballX = (paddleX + paddleWidth / 2) - 10;
        ballY = gameHeight - paddleHeight - 35;
        gameStarted = false;
        if(player.lives <= 0){
          overlayText.textContent = "Game over! Press 'R' to restart";
          overlay.style.display = "block";
          gameOver = true;
          clearInterval(timerId);
        }
        if(player.lives >= 1){
          stopGame();
        }
        return;
    }
    let xDir = -1;
    let division = 2 / (paddleWidth);
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
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
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
      bricks.splice(i, 1);
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
  if (brickAmount <= 0){
    clearInterval(timerId);
    if(player.level == 5){
      overlayText.textContent = `You win! Score: ${player.points} Press "r" to play again.`;
      overlay.style.display = "block";
    } else {
      overlayText.textContent = `Level completed. Press space to continue.`;
     overlay.style.display = "block";
      player.level++;
    }
    gameStarted = false;
    gameOver = true;
 

  }
}




function gameLoop() {
  console.log("ok");
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

export function initiateGame(){
  drawBricks(player.level);
  ballX = (paddleX + paddleWidth / 2) - 10;
  ballY = gameHeight - paddleHeight - 35;
  gameLoop();
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);
