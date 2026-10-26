//ЗАГРУЗКА ДЖСОНА
import {loadJson} from "./loader.js";

import {startTranslateGame} from "./games/translate.js";
import {startWrongGame} from "./games/wrong.js";
import {startBuildWordGame} from "./games/buildWord.js";

import {showScreen} from "./utils.js";
import {getGameResults} from "./progress.js";

// поиск элементов

const startScreenBox = document.getElementById("start-screen"); // экран выбора игры
const selectTranslateButton = document.getElementById("select-translate");
const selectWrongButton = document.getElementById("select-wrong");
const selectBuildWordButton = document.getElementById("select-build-word");
const toMainButton = document.getElementById("to-main");

const selectScreenBox = document.getElementById("select-screen"); // экран выбора темы
const buttonsBox = document.getElementById("buttons");
const toStartScreenButton = document.getElementById("to-start-screen");

//текущаяя игра
let currentGame;
let currentGameId; // название игры в базе
let vocabulary; // темы и слова






//СПАВН КНОПОК
async function addButtons() {
    const results = await getGameResults(currentGameId); // результаты в этой игре

    buttonsBox.textContent = "";
    for (const theme of vocabulary.themes) {

        const themeButton = document.createElement("button");
        themeButton.textContent = theme.title;

        // если тему уже проходили, пишем результат
        const result = results.find(item => item.theme_id === theme.id);
        if (result) {
            themeButton.textContent = `${theme.title} ${result.score}/${result.total}`;
        }

        buttonsBox.appendChild(themeButton);
        themeButton.addEventListener("click", () => {
            currentGame(theme, vocabulary);
        });
    }
}

//ПРОГРЕСС НА КНОПКАХ ИГР (сколько тем пройдено)
async function showGameProgress() {
    for (const game of ["translate", "wrong", "build-word"]) {
        const results = await getGameResults(game);
        document.getElementById("progress-" + game).textContent = `${results.length}/${vocabulary.themes.length}`;
    }
}




//СТАРТ
async function start() {
    vocabulary = await loadJson();
    if (vocabulary) {
        showGameProgress();
    }
}


// обработчики кнопок

selectTranslateButton.addEventListener("click", async () => {
    currentGame = startTranslateGame;
    currentGameId = "translate";
    await addButtons();
    showScreen(selectScreenBox);
});

selectWrongButton.addEventListener("click", async () => {
    currentGame = startWrongGame;
    currentGameId = "wrong";
    await addButtons();
    showScreen(selectScreenBox);
});

selectBuildWordButton.addEventListener("click", async () => {
    currentGame = startBuildWordGame;
    currentGameId = "build-word";
    await addButtons();
    showScreen(selectScreenBox);
});

toMainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});

toStartScreenButton.addEventListener("click", () => {
    showScreen(startScreenBox);
});






// после сохранения результата обновляем надписи
document.addEventListener("progress-saved", () => {
    showGameProgress();
    addButtons();
});

start();