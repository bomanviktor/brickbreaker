import { initiateGame } from "./game.js";
import { handleKeyDown } from "./menu.js"

function main(){
    // Listen for the "start game" event
    document.addEventListener('startGame', () => {
        initiateGame();
    });
    // Start the menu
    document.addEventListener('keydown', handleKeyDown)
}

main();
