import { gameState } from "./game.js";
import { menuState } from "./menu.js";
import { leaderboardHandler } from "./menu.js";
const menuElement = document.getElementById('menu-wrapper');
const gameElement = document.getElementById('game-area');
const scoreboardElement = document.getElementById('scoreboard');
const mainMenuElement = document.getElementById('menu');
const gameOverElement = document.getElementById('game-over');

export const VIEWSCREEN = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    SCOREBOARD: 'scoreBoard'
};

export function view(screen){
    switch(screen){
        case 'menu':
            console.log("works!");
            showMenu();
            break;
        case 'playing':
            showGame();
            break;
        case 'gameOver':
            gameOver();
            break;
        case 'scoreBoard':
            showScoreBoard();
            break;
    }
}

function showMenu(){
    if (menuElement){
        menuElement.style.display = "flex";
        mainMenuElement.style.display = "flex";
        Object.assign(gameState, {Started: false, Paused: false, Story: false})
        Object.assign(menuState, {outsideMenu: false, outsideMain: false})
        hideGame();
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
        hideScoreBoard();
        hideMenu();
    }
}

function hideGame(){
    if (gameElement && scoreboardElement) {
        gameElement.style.display = "none";
        Object.assign(gameState, {Started: false, Paused: false, Story: false})
    }
}

function gameOver(){
    if (gameOverElement && menuElement) {
        menuElement.style.display = "flex";
        gameOverElement.style.display = "flex";
        Object.assign(gameState, {Started: false, Paused: false, Story: false, Over: true})
        hideGame();
        hideScoreBoard();
    }
}

function hideGameOver(){
    gameOverElement.style.display = "none";
}

function showScoreBoard(){
    Object.assign(gameState, {Started: false, Paused: false, Story: false, Over: true, myLedgerBoard: true})
        leaderboardHandler();
        hideGame();
        hideGameOver();
}

function hideScoreBoard(){
        scoreboardElement.style.display = "none";
}

// THESE ELEMENTS ARE SUCH THAT ONLY ONE OF THEM NEEDS TO BE SHOWN AT A TIME
// Array of elements

// [scoreboardElement, menuElement, gameOverElement, gameElement, ]
