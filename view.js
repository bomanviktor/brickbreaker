import { gameState } from "./game.js";
import { menuState } from "./menu.js";
const menuElement = document.getElementById('menu-wrapper');
const gameElement = document.getElementById('game-area');
const scoreboardElement = document.getElementById('scoreboard');
const mainMenuElement = document.getElementById('menu');
const gameOverElement = document.getElementById('game-over');

export const STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

export function view(screen){
    switch(screen){
        case 'menu':
            console.log("works!");
            showMenu();
            hideGame();
            break;
        case 'playing':
            hideMenu();
            showGame();
            break;
        case 'gameOver':
            hideGame();
            gameOver();
            break;
    }
}

function showMenu(){
    if (menuElement){
        menuElement.style.display = "flex";
        mainMenuElement.style.display = "flex";
        Object.assign(gameState, {Started: false, Paused: false, Story: false})
        Object.assign(menuState, {outsideMenu: false, outsideMain: false})
    }
}

function hideMenu(){
    if (menuElement){
        menuElement.style.display = "none";
        mainMenuElement.style.display = "none";
        Object.assign(menuState, {outsideMenu: true, outsideMain: true})
    }
}

function showGame(){
    if (gameElement && scoreboardElement){
        gameElement.style.display = "grid";
        scoreboardElement.style.display = "flex";
        Object.assign(gameState, {Started: false, Paused: false, Story: false})
    }
}

function hideGame(){
    if (gameElement && scoreboardElement) {
        gameElement.style.display = "none";
        scoreboardElement.style.display = "none";
        Object.assign(gameState, {Started: false, Paused: false, Story: false})
    }

}

function gameOver(){
    if (gameOverElement && menuElement) {
        menuElement.style.display = "flex";
        gameOverElement.style.display = "flex";
        Object.assign(gameState, {Started: false, Paused: false, Story: false, Over: true})
    }

}
