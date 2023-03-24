import { initiateLevel } from "./game.js";
import { handleKeyPress } from "./menu.js"

function main(){
    // Listen for the "start game" event
    document.addEventListener('startGame', () => {
        initiateLevel();
    });
    // Start the menu
    document.addEventListener('keydown', handleKeyPress)
}

main();
