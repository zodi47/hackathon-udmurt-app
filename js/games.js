//ЗАГРУЗКА ДЖСОНА
import {loadJson} from "./loader.js";

import {startTranslateGame} from "./games/translate.js";

import {showScreen} from "./utils.js";

// поиск элементов

const startScreenBox = document.getElementById("start-screen"); // экран выбора игры
const selectTranslateButton = document.getElementById("select-translate");
const toMainButton = document.getElementById("to-main");

const selectScreenBox = document.getElementById("select-screen"); // экран выбора темы
const buttonsBox = document.getElementById("buttons");
const toStartScreenButton = document.getElementById("to-start-screen");

//текущаяя игра
let currentGame;






//СПАВН КНОПОК
function addButtons(vocabulary) {
    for (const theme of vocabulary.themes) {

        const themeButton = document.createElement("button");
        themeButton.textContent = theme.title;
        buttonsBox.appendChild(themeButton);
        themeButton.addEventListener("click", () => {
            currentGame(theme);
        });
    }
}




//СТАРТ
async function start() {
    const vocabulary = await loadJson();
    if (vocabulary) {
        addButtons(vocabulary);
    }
}


// обработчики кнопок

selectTranslateButton.addEventListener("click", () => {
    currentGame = startTranslateGame;
    showScreen(selectScreenBox);
});

toMainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

toStartScreenButton.addEventListener("click", () => {
    showScreen(startScreenBox);
});






start();