import {shuffle, showScreen} from "../utils.js";
import {saveGameResult} from "../progress.js";



const gameScreenBox = document.getElementById("game-wrong-screen"); // экран вопроса
const closeButton = document.getElementById("wrong-close");
const wordsText = document.getElementById("wrong-words");
const countText = document.getElementById("wrong-count");
const optionsBox = document.getElementById("wrong-options");
const nextButton = document.getElementById("wrong-next");

const endGameScreenBox = document.getElementById("wrong-end-screen"); // экран результата
const resultText = document.getElementById("wrong-result-text");
const resultScoreText = document.getElementById("wrong-result-score");
const playAgainButton = document.getElementById("wrong-play-again");
const toThemesButton = document.getElementById("wrong-to-themes");

const selectScreenBox = document.getElementById("select-screen");



// настройки игры

const maxQuestions = 10; // сколько вопросов
const maxOptions = 4; // сколько слов в вопросе


// счетчики

let currentTheme; // тема
let currentVocabulary; // все темы
let questions = []; // вопросы
let index = 0; // номер вопроса
let score = 0; // кол-во правильных ответов


//начало игры
export function startWrongGame(gameTheme, vocabulary) {
    currentTheme = gameTheme;
    currentVocabulary = vocabulary;

// слова из всех остальных тем
    const otherWords = [];
    for (const theme of currentVocabulary.themes) {
        if (theme !== currentTheme) {
            for (const word of theme.words) {
                otherWords.push(word);
            }
        }
    }

// если не хватает слов игра не начинается
    if (currentTheme.words.length < maxOptions - 1 || otherWords.length === 0) {
        alert("В этой теме мало слов для игры");
        return;
    }

// для каждого вопроса слова из темы и еше одно лишнее из другой темы
    questions = [];
    for (let i = 0; i < maxQuestions; i++) {
        const options = shuffle(currentTheme.words).slice(0, maxOptions - 1);
        const wrongWord = shuffle(otherWords)[0];
        options.push(wrongWord);
        questions.push({words: shuffle(options), wrongWord: wrongWord});
    }

    index = 0;
    score = 0;

    showQuestion();
}

//создание кнопок со словами
function addOptions(currentQuestion) {
    optionsBox.textContent = "";
    for (const word of currentQuestion.words) {
        const optionButton = document.createElement("button");
        optionButton.classList.add("option");
        optionButton.textContent = word.word;
        optionsBox.appendChild(optionButton);
        optionButton.addEventListener("click", () => {
            checkAnswer(optionButton);
        });
    }
}

//показ вопроса
function showQuestion() {
    const currentQuestion = questions[index];

    wordsText.textContent = "";
    countText.textContent = `${index + 1}/${questions.length}`;

    if (index == questions.length - 1) {
        nextButton.textContent = "Результат";
    } else {
        nextButton.textContent = "Далее";
    }
    nextButton.hidden = true;

    addOptions(currentQuestion);
    showScreen(gameScreenBox);
}

//проверка ответа
function checkAnswer(button) {
    const wrongWord = questions[index].wrongWord;
    const optionButtons = optionsBox.querySelectorAll("button"); // все кнопки вариантов

    for (const optionButton of optionButtons) {
        optionButton.disabled = true;
        if (optionButton.textContent === wrongWord.word) {
            optionButton.classList.add("correct");
        }
    }

    if (button.textContent === wrongWord.word) {
        score++;
    } else {
        button.classList.add("wrong");
    }

// лишнее слово
    wordsText.textContent = `Лишнее слово: ${wrongWord.word} (${wrongWord.translation})`;

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

    saveGameResult("wrong", currentTheme.id, score, questions.length);
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
    startWrongGame(currentTheme, currentVocabulary);
});

toThemesButton.addEventListener("click", () => {
    showScreen(selectScreenBox);
});
