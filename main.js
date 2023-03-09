const brickWidth = 75;
const brickHeight = 35;


const levels = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

const brickArea = document.querySelector(".brick-area");

let bricks = [];

function drawBricks() {
    for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < levels[i].length; j++) {
            if (levels[i][j] === 1) {
                let brick = document.createElement("div");
                brick.classList.add("brick");
                brick.style.gridColumn = j + 1;
                brick.style.gridRow = i + 1;
                brickArea.appendChild(brick);
                bricks.push(brick);
                // bricks[i][j] = brick;
            }
        }
    }
}
drawBricks();

function resetBricks() {
  for (let i = 0; i < bricks.length; i++) {
    brickArea.removeChild(bricks[i]);
  }
  bricks = [];
}



// GAME DEFINITION CONSTANTS.
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

// PLAYER OBJECT
let player = {
    level: 1,
    points: 0,
    time: 0,
    lives: 3
}

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
  resetBricks();
  drawBricks();
  document.querySelector(".overlay").textContent = "Press space to start";
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
        if(!gameStarted){
            gameStarted = true;
            startTimer();
            document.querySelector(".overlay").style.display = "none";
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
      } else if (gameOver){
        resetGame();
        gameOver = false;
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
    if (ballLeft <= 0 || ballRight >= gameWidth){
        ballDirection.x *= -1;
    }

    // Checks if ball hits bottom. Player then loses a life. If life == 0, game over screen.
    if (ballBottom >= gameHeight){
        player.lives--;
        ballX = (paddleX + paddleWidth / 2) - 10;
        ballY = gameHeight - paddleHeight - 35;
        gameStarted = false;
        if(player.lives <= 0){
          document.querySelector(".overlay").textContent = "GAME OVER! Press r to restart.";
          document.querySelector(".overlay").style.display = "block";
          // drawBricks();
          gameOver = true;
          clearInterval(timerId);
        } else {
          stopGame();
        }
        return;
    }
  
    // Check if the edges of the ball and the paddle overlap
    if (
      ballRight >= paddleLeft &&
      ballLeft <= paddleRight &&
      ballBottom >= paddleTop &&
      ballTop <= paddleBottom - 20
    ) {
        if(rightKeyPressed && ballDirection.x <= 1){
            ballDirection.x <= 0.5 ? ballDirection.x += 0.1 : ballDirection.x += 0.2;
            ballDirection.y += -1;
        } else if(leftKeyPressed && ballDirection.x >= -1){
            ballDirection.x <= -0.5 ? ballDirection.x += -0.1 : ballDirection.x += -0.2;
            ballDirection.y = -1;
        } else {
            ballDirection.y = -1;
        }
      // If there is a collision, change direction of ball.
    }


  // Loop through each brick and check for collision
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    const brickLeft = brick.offsetLeft;
    const brickRight = brick.offsetLeft + brick.offsetWidth;
    const brickTop = brick.offsetTop;
    const brickBottom = brick.offsetTop + brick.offsetHeight;

    if (
        ballRight >= brickLeft &&
        ballLeft <= brickRight &&
        ballBottom <= brickBottom &&
        ballTop >= brickTop
    ) {
      console.log(bricks);
        brick.remove();
        bricks.splice(i, 1);
        ballDirection.x *= -1;
        player.points += 10;
    } else if (
        ballRight >= brickLeft &&
        ballLeft <= brickRight &&
        ballBottom >= brickTop &&
        ballTop <= brickBottom
      ) {
        console.log(bricks);
        brick.remove();
        bricks.splice(i, 1);
        ballDirection.y *= -1;
        player.points += 10;
      }


  }
}

function updateScoreboard(){
    document.getElementById("level").innerText = "LEVEL: " + player.level;
    document.getElementById("lives").innerText = "LIVES: " + player.lives;
    document.getElementById("score").innerText = "SCORE: " + player.points;
}

const timerElement = document.getElementById("time");

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
    document.querySelector(".overlay").textContent = "Press space to start";
    document.querySelector(".overlay").style.display = "block";
  }

function pauseGame(){
    if (!paused && !gameOver){
        clearInterval(timerId);
        paused = true;
        document.querySelector(".overlay").textContent = "Paused \n Press 'r' to restart";
        document.querySelector(".overlay").style.display = "block";
    } else {
        paused = false;
        document.querySelector(".overlay").style.display = "none";
        startTimer();
    }
}

window.addEventListener("keydown", keyDownHandler);
window.addEventListener("keyup", keyUpHandler);

function gameLoop() {
    if(!paused){
        checkCollision();
        movePaddle();
        drawPaddle();
        updateBallPosition();
        drawBall();
        updateScoreboard();
    }
    requestAnimationFrame(gameLoop);
}


gameLoop();

