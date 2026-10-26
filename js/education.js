//ЗАГРУЗКА ДЖСОНА
import {loadJson} from "./loader.js";
import {showScreen} from "./utils.js";

import {replayAnimation} from "./utils.js";



const startScreenBox = document.getElementById("start-screen");
const buttonsBox = document.getElementById("buttons");
const toMainButton = document.getElementById("to-main");

const educationScreenBox = document.getElementById("education-screen");
const wordText = document.getElementById("word");
const pronunciationText = document.getElementById("pronunciation");
const translationText = document.getElementById("translation");
const countText = document.getElementById("count");
const nextButton = document.getElementById("next");
const backButton = document.getElementById("back");
const toListButton = document.getElementById("to-list");

// счетчики текущего слова и темы
let index = 0;
let theme;

//СПАВН КНОПОК
function addButtons(vocabulary) {
    for (const theme of vocabulary.themes) {

            const themeButton = document.createElement("button");
            themeButton.textContent = theme.title;
            buttonsBox.appendChild(themeButton);
            themeButton.addEventListener("click", () => {
                openTheme(theme);
            });
        }
}

//открытие темы (раздела)
function openTheme(open_theme){
    index = 0;
    theme = open_theme;
    showCard();
}

//показ карточки слова
function showCard(){

    backButton.disabled = index == 0;
    nextButton.disabled = index == theme.words.length - 1;

    wordText.textContent = theme.words[index].word;
    pronunciationText.textContent = theme.words[index].pronunciation;
    translationText.textContent = theme.words[index].translation;
    countText.textContent = `${index+1}/${theme.words.length}`;

    replayAnimation(wordText);
    replayAnimation(pronunciationText);
    replayAnimation(translationText);

    showScreen(educationScreenBox);
}






//СТАРТ
async function start() {
    const vocabulary = await loadJson();
    addButtons(vocabulary);
}




//обработчики кнопок
nextButton.addEventListener("click", () => {
    index++;
    showCard();
});

backButton.addEventListener("click", () => {
    index--;
    showCard();
});

toListButton.addEventListener("click", () => {
    showScreen(startScreenBox);
});
toMainButton.addEventListener("click", () => {
    if (confirm("Вернуться на главную страницу?") === true) {
        window.location.href = "../index.html";
    }
});




start();
