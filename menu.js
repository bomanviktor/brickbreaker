const menuItems = document.querySelectorAll('.menu button');
const mainMenu = document.querySelector('.menu');
const instructions = document.querySelector('.instructions');
const leaderboard = document.querySelector('.leaderboard');
const credit = document.querySelector('.credit');
const returnButton = document.getElementById('return');



export let startGame = false;
let selectedItemIndex = 0;
let outsideMain = false;

export function selectMenuItem(index) {
  // Remove the 'selected' class from all menu items
  menuItems.forEach(item => item.classList.remove('selected'));
  
  // Add the 'selected' class to the selected menu item
  menuItems[index].classList.add('selected');
  
  // Update the selectedItemIndex variable
  selectedItemIndex = index;
}

export function handleKeyDown(event) {
  switch (event.code) {
    case 'ArrowUp':
      if (selectedItemIndex > 0) {
        selectMenuItem(selectedItemIndex - 1);
      }
      if (selectedItemIndex === 0){
        selectMenuItem(-1);
      }
      break;
    case 'ArrowDown':
      if (selectedItemIndex < menuItems.length - 1) {
        selectMenuItem(selectedItemIndex + 1);
      }
      if (selectedItemIndex === menuItems.length - 1) {
        selectMenuItem(0)
      }
      break;
    case 'Enter':
        if(outsideMain){
            returnToMain();
            break;
        }
        switch(selectedItemIndex){
            case 0:
                startGame();
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
function startGame(){
    mainMenu.style.display = "none";
    document.querySelector
    outsideMain = true;
    startGame = true;
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
    outsideMain = false;
}



document.addEventListener('keydown', handleKeyDown);
