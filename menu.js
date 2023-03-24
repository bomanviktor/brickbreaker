import { gameState, resetGame } from "./game.js";
import { menuNavigation, menuSelection } from "./audio.js";
import { VIEWSCREEN, view } from "./view.js";

// MENU QUERYSELECTORS
const menuItems = document.querySelectorAll('.menu button');
const mainMenu = document.querySelector('.menu');
const instructions = document.getElementById('instructions-menu');
const leaderboard = document.getElementById('leaderboard-menu');
const credit = document.getElementById('credit-menu');
const gameOverElement = document.getElementById('game-over');

export const menuState = {
  outsideMenu: false,
  outsideMain: false,
}

// This variable is for selectMenuItem & handleKeyPress to move through items
let selectedItemIndex = 0;
function selectMenuItem(index = 0) {
  // Remove the 'selected' class from all menu items
  menuItems.forEach(item => item.classList.remove('selected'));

  // Add the 'selected' class to the selected menu item
  menuItems[index].classList.add('selected');

  // Update the selectedItemIndex variable
  selectedItemIndex = index;
}

export function handleKeyPress(event) {
  switch (event.key) {
    case 'ArrowUp':
      menuNavigation.play();
      if (menuState.outsideMenu) break;
      if (selectedItemIndex > 0) {
        selectMenuItem(selectedItemIndex - 1);
      }
      break;
    case 'ArrowDown':
      menuNavigation.play();
      if (menuState.outsideMenu) break;
      if (selectedItemIndex < menuItems.length - 1) {
        selectMenuItem(selectedItemIndex + 1);
      }
      break;
    case 'Enter':
      if (!menuState.outsideMenu) menuSelection.play();
      if(gameState.Story) break;
      if(gameState.Over) {
        view(VIEWSCREEN.SCOREBOARD);
        break;
      }
      if (menuState.outsideMain) {
        returnToMain();
        break;
      }
      switch (selectedItemIndex) {
        case 0:
          console.log("game start!");
          startGameHandler();
          break;
        case 1:
          instructionsHandler();
          break;
        case 2:
          leaderboardHandler();
          break;
        case 3:
          creditHandler();
          break;
      }
      break;
  }
}

function startGameHandler() {
  if (!menuState.outsideMenu) {
    mainMenu.style.display = "none";
    document.querySelector(".scoreboard").style.display = "flex";
    document.querySelector(".game-area").style.display = "grid";
    resetGame();
    document.dispatchEvent(new Event('startGame'));
    menuState.outsideMain = true;
    menuState.outsideMenu = true;
  }
}

function instructionsHandler() {
  mainMenu.style.display = "none";
  instructions.style.display = "flex";
  menuState.outsideMain = true;
}

export function leaderboardHandler() {
  mainMenu.style.display = "none";
  leaderboard.style.display = "flex";
  menuState.outsideMain = true;
  menuState.outsideMenu = false;
  fetch("http://localhost:5502/api/leaderboard")
    .then(response => response.json())
    .then(data => {
      const ledata = document.getElementById("ledata");
      if (data.length === 0) {
        ledata.innerHTML = "LedgerBoard is Empty.<br/> Play some games first";
      } else {
        ledata.innerHTML = JSON.stringify(data);
      }
    })
    .catch(error => console.log(error));
}

function creditHandler() {
  mainMenu.style.display = "none";
  credit.style.display = "flex";
  menuState.outsideMain = true;
}

function returnToMain() {
  mainMenu.style.display = "flex";
  instructions.style.display = "none";
  leaderboard.style.display = "none";
  credit.style.display = "none";
  gameOverElement.style.display = "none";
  menuState.outsideMain = false;
}

document.addEventListener('keydown', handleKeyPress);
