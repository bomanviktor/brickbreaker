import { player } from "./game.js";

// Update the timer every second
export let timerId;
export function startTimer() {
    timerId = setInterval(function () {
      player.time++;
      document.getElementById("timer").textContent = "TIME: " + player.time;
    }, 1000);
}

export function updateScoreboard() {
    document.getElementById("level").innerText = "LEVEL: " + player.level;
    document.getElementById("lives").innerText = "LIVES: " + player.lives;
    document.getElementById("score").innerText = "SCORE: " + player.points;
  }
  
  
