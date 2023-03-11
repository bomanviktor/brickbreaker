import { resetGame, insideStory } from "./game.js";
import { menuNavigation, menuSelection } from "./audio.js";

// MENU QUERYSELECTORS
const menuItems = document.querySelectorAll('.menu button');
const mainMenu = document.querySelector('.menu');
const instructions = document.getElementById('instructions-menu');
const leaderboard = document.getElementById('leaderboard-menu');
const credit = document.getElementById('credit-menu');
const finishGame = document.getElementById('finish-game');
const loseGame = document.getElementById('lose-game');

export let outsideMenu = false;
let outsideMain = false;


// This variable is for selectMenuItem & handleKeyDown to move through items
let selectedItemIndex = 0;
function selectMenuItem(index = 0) {
  // Remove the 'selected' class from all menu items
  menuItems.forEach(item => item.classList.remove('selected'));
  
  // Add the 'selected' class to the selected menu item
  menuItems[index].classList.add('selected');
  
  // Update the selectedItemIndex variable
  selectedItemIndex = index;
}

export function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      menuNavigation.play();
      if (selectedItemIndex > 0) {
        selectMenuItem(selectedItemIndex - 1);
      }
      break;
    case 'ArrowDown':
      menuNavigation.play();
      if (selectedItemIndex < menuItems.length - 1) {
        selectMenuItem(selectedItemIndex + 1);
      }
      break;
    case 'Enter':
        if(!outsideMenu) menuSelection.play();
        if(outsideMain){
            returnToMain();
            break;
        }
        switch(selectedItemIndex){
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

function startGameHandler(){
    if(!outsideMenu){
      mainMenu.style.display = "none";
      document.querySelector(".scoreboard").style.display = "flex";
      document.querySelector(".game-area").style.display = "grid";
      resetGame();
      document.dispatchEvent(new Event('startGame'));
      outsideMain = true;
      outsideMenu = true;
    }
}

function instructionsHandler(){
    mainMenu.style.display = "none";
    instructions.style.display = "flex";
    outsideMain = true;
}

function leaderboardHandler(){
    mainMenu.style.display = "none";
    leaderboard.style.display = "flex";
    outsideMain = true;
}

function creditHandler(){
    mainMenu.style.display = "none";
    credit.style.display = "flex";
    outsideMain = true;
}


function returnToMain(){
    mainMenu.style.display = "flex";
    instructions.style.display = "none";
    leaderboard.style.display = "none";
    credit.style.display = "none";
    loseGame.style.display = "none";
    finishGame.style.display = "none";
    outsideMain = false;
}

document.addEventListener('keydown', handleKeyDown);
