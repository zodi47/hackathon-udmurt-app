import {shuffle, showScreen} from "../utils.js";

const gameScreenBox = document.getElementById("game-screen"); // экран вопроса
const closeButton = document.getElementById("close-btn");
const wordText = document.getElementById("word");
const countText = document.getElementById("count");
const optionsBox = document.getElementById("options");
const nextButton = document.getElementById("next");

const endGameScreenBox = document.getElementById("end-game-screen"); // экран результата
const resultText = document.getElementById("result-text");
const resultScoreText = document.getElementById("result-score");
const playAgainButton = document.getElementById("play-again");
const toThemesButton = document.getElementById("to-themes");

const selectScreenBox = document.getElementById("select-screen");



// настройки игры

const maxQuestions = 10; // сколько вопросов
const maxOptions = 4; // сколько вариантов ответа


// счетчики

let currentTheme; // тема
let questions = []; // слова
let index = 0; // номер вопроса
let score = 0; // кол-во правильных ответов


//начало игры
export function startTranslateGame(game_theme) {
    currentTheme = game_theme;
    questions = shuffle(currentTheme.words).slice(0, maxQuestions);
    index = 0;
    score = 0;

    showQuestion();
}

//создание кнопок с вариантами ответа
function addOptions(currentWord) {
    const options = [currentWord.translation];
    for (const item of shuffle(currentTheme.words)) {
        if (options.length < maxOptions && !options.includes(item.translation)) {
            options.push(item.translation);
        }
    }

    optionsBox.textContent = "";
    for (const text of shuffle(options)) {
        const optionButton = document.createElement("button");
        optionButton.classList.add("option");
        optionButton.textContent = text;
        optionsBox.appendChild(optionButton);
        optionButton.addEventListener("click", () => {
            checkAnswer(optionButton);
        });
    }
}

//показ вопроса
function showQuestion() {
    const currentWord = questions[index];

    wordText.textContent = currentWord.word;
    countText.textContent = `${index + 1}/${questions.length}`;

    if (index == questions.length - 1) {
        nextButton.textContent = "Результат";
    } else {
        nextButton.textContent = "Далее";
    }
    nextButton.hidden = true;

    addOptions(currentWord);
    showScreen(gameScreenBox);
}

//проверка ответа
function checkAnswer(button) {
    const correctTranslation = questions[index].translation;
    const optionButtons = optionsBox.querySelectorAll("button"); // все кнопки вариантов

    for (const optionButton of optionButtons) {
        optionButton.disabled = true;
        if (optionButton.textContent === correctTranslation) {
            optionButton.classList.add("correct");
        }
    }

    if (button.textContent === correctTranslation) {
        score++;
    } else {
        button.classList.add("wrong");
    }

    nextButton.hidden = false;
}

//показ результата
function showResult() {
    if (score == questions.length) {
        resultText.textContent = "Отлично!";
    } else {
        resultText.textContent = "Тема пройдена!";
    }
    
    resultScoreText.textContent = `Правильных ответов: ${score} из ${questions.length}`;

    showScreen(endGameScreenBox);
}





//обработчики

nextButton.addEventListener("click", () => {
    index++;
    if (index === questions.length) {
        showResult();
    } else {
        showQuestion();
    }
});

closeButton.addEventListener("click", () => {
    if (confirm("Вернуться на страницу выбора тем?") === true) {
        showScreen(selectScreenBox);
    }
});

playAgainButton.addEventListener("click", () => {
    startTranslateGame(currentTheme);
});

toThemesButton.addEventListener("click", () => {
    showScreen(selectScreenBox);
});