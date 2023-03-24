import { gameState, Ball, Paddle, levelText, overlay, pauseGame, resetGame, paddleElem, player } from "./game.js";
import { VIEWSCREEN, view } from "./view.js";
import { startTimer } from "./scoreboard.js";

// KEEPS TRACK OF KEY PRESSED
export let keyPressed = {
    Left: false,
    Right: false,
    Shift: false
  }

// HANDLES ALL KEYDOWN PRESSES. ENABLES RESTART LEVEL IF GAME IS PAUSED.
export function keyDownHandler(event) {
    switch (event.key.toLowerCase()) {
      case "arrowleft":
        keyPressed.Left = true;
        break;
      case "arrowright":
        keyPressed.Right = true;
        break;
      case "shift":
        keyPressed.Shift = true;
        break;
      case " ":
        if (!gameState.Started && !gameState.Story) {
          gameState.firstTime = false;
          gameState.Started = true;
          startTimer();
          overlay.style.display = "none";
          Ball.Direction.y = -1;
          Ball.Direction.x = Math.random() / 2 - 0.5;
        }
        if (gameState.Story) {
          gameState.Story = false;
          levelText.style.display = "none";
          overlay.style.display = "block";
        }
        break;
      case "p":
        gameState.Started && pauseGame();
        break;
      case "r":
        if (gameState.Started && gameState.Paused && !gameState.Story) {
          resetGame();
        }
        gameState.Over && resetGame();
        break;
      case "t":
        player.brickAmount = 0;
        break;
      case "m":
        view(VIEWSCREEN.MENU);
        break;
    }
  }
  
  // KEYUP HANDLER
  export function keyUpHandler(event) {
    switch (event.key) {
      case "ArrowLeft":
        keyPressed.Left = false;
        break;
      case "ArrowRight":
        keyPressed.Right = false;
        break;
      case "Shift":
        keyPressed.Shift = false;
        break;
    }
  }
// MOVES THE PADDLE
export function movePaddle() {
    Paddle.Speed = keyPressed.Shift ? 8 : 4;
    Paddle.X += (keyPressed.Right - keyPressed.Left) * Paddle.Speed;
    Paddle.X = Math.min(Math.max(Paddle.X, 0), 800 - Paddle.Width);
    paddleElem.style.left = Paddle.X + "px";
  }
  