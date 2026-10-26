import {shuffle, showScreen} from "../utils.js";
import {saveGameResult} from "../progress.js";

const gameScreenBox = document.getElementById("game-build-word-screen"); // экран вопроса
const closeButton = document.getElementById("build-word-close");
const wordText = document.getElementById("build-word-text");
const countText = document.getElementById("build-word-count");
const answerText = document.getElementById("build-word-answer");
const optionsBox = document.getElementById("build-word-options");
const resetButton = document.getElementById("build-word-reset");
const nextButton = document.getElementById("build-word-next");

const endGameScreenBox = document.getElementById("build-word-end-screen"); // экран результата
const resultText = document.getElementById("build-word-result-text");
const resultScoreText = document.getElementById("build-word-result-score");
const playAgainButton = document.getElementById("build-word-play-again");
const toThemesButton = document.getElementById("build-word-to-themes");

const selectScreenBox = document.getElementById("select-screen");



// настройки игры

const maxQuestions = 10; // сколько вопросов


// счетчики

let currentTheme; // тема
let questions = []; // слова
let index = 0; // номер вопроса
let score = 0; // кол-во правильных ответов
let answer = ""; // собранное слово


//начало игры
export function startBuildWordGame(gameTheme) {
    currentTheme = gameTheme;

// подходят слова без пробелов (фразы не берем)
    const suitableWords = [];
    for (const word of currentTheme.words) {
        if (!word.word.includes(" ")) {
            suitableWords.push(word);
        }
    }

    if (suitableWords.length === 0) {
        alert("В этой теме нет подходящих слов для игры");
        return;
    }

    questions = shuffle(suitableWords).slice(0, maxQuestions);
    index = 0;
    score = 0;

    showQuestion();
}

//создание кнопок с буквами
function addChars(currentWord) {
    const chars = currentWord.word.split("");
    let mixedChars = shuffle(chars);

// если буквы встали как в слове, перемешиваем еще раз
    while (mixedChars.join("") === currentWord.word) {
        mixedChars = shuffle(chars);
    }

    optionsBox.textContent = "";
    for (const char of mixedChars) {
        const charButton = document.createElement("button");
        charButton.classList.add("chars");
        charButton.textContent = char;
        optionsBox.appendChild(charButton);
        charButton.addEventListener("click", () => {
            addChar(charButton);
        });
    }
}

//добавление буквы в ответ
function addChar(button) {
    answer += button.textContent;
    answerText.textContent = answer;
    button.disabled = true;

    if (answer.length === questions[index].word.length) {
        checkAnswer();
    }
}

//очистка ответа
function resetAnswer() {
    answer = "";
    answerText.textContent = "";

    const charButtons = optionsBox.querySelectorAll("button"); // все кнопки с буквами
    for (const charButton of charButtons) {
        charButton.disabled = false;
    }
}

//показ вопроса
function showQuestion() {
    const currentWord = questions[index];

    wordText.textContent = currentWord.translation;
    countText.textContent = `${index + 1}/${questions.length}`;

    answer = "";
    answerText.textContent = "";
    answerText.classList.remove("correct", "wrong");

    if (index == questions.length - 1) {
        nextButton.textContent = "Результат";
    } else {
        nextButton.textContent = "Далее";
    }
    nextButton.hidden = true;
    resetButton.hidden = false;

    addChars(currentWord);
    showScreen(gameScreenBox);
}

//проверка ответа
function checkAnswer() {
    const currentWord = questions[index];
    const charButtons = optionsBox.querySelectorAll("button"); // все кнопки с буквами

    for (const charButton of charButtons) {
        charButton.disabled = true;
    }

    if (answer === currentWord.word) {
        score++;
        answerText.classList.add("correct");
    } else {
        answerText.classList.add("wrong");
    }

    // показываем перевод и правильное слово
    wordText.textContent = `${currentWord.translation} - ${currentWord.word}`;

    resetButton.hidden = true;
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

    saveGameResult("build-word", currentTheme.id, score, questions.length);
    showScreen(endGameScreenBox);
}





//обработчики

resetButton.addEventListener("click", () => {
    resetAnswer();
});

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
    startBuildWordGame(currentTheme);
});

toThemesButton.addEventListener("click", () => {
    showScreen(selectScreenBox);
});
