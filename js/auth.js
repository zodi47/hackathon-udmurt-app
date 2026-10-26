import {showScreen} from "./utils.js";
import {getCurrentUser, register, login} from "./account.js";

// поиск элементов

const authScreenBox = document.getElementById("auth-screen"); // экран выбора
const openRegisterButton = document.getElementById("open-register");
const openLoginButton = document.getElementById("open-login");

const registerScreenBox = document.getElementById("register-screen"); // экран регистрации
const registerNameInput = document.getElementById("register-name");
const registerPasswordInput = document.getElementById("register-password");
const registerErrorText = document.getElementById("register-error");
const registerButton = document.getElementById("register-button");
const registerBackButton = document.getElementById("register-back");

const loginScreenBox = document.getElementById("login-screen"); // экран входа
const loginNameInput = document.getElementById("login-name");
const loginPasswordInput = document.getElementById("login-password");
const loginErrorText = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");
const loginBackButton = document.getElementById("login-back");

const menuLinks = document.querySelectorAll("main > a"); // ссылки главного меню


// функции

//показ главного меню
function showMenu() {
    const screens = document.querySelectorAll("main section");
    for (const screen of screens) {
        screen.hidden = true;
    }
    for (const link of menuLinks) {
        link.hidden = false;
    }
}


// если уже входили, окно не показываем
if (getCurrentUser() !== null) {
    showMenu();
}


// обработчики кнопок

openRegisterButton.addEventListener("click", () => {
    registerErrorText.textContent = "";
    showScreen(registerScreenBox);
});

openLoginButton.addEventListener("click", () => {
    loginErrorText.textContent = "";
    showScreen(loginScreenBox);
});

registerBackButton.addEventListener("click", () => {
    showScreen(authScreenBox);
});

loginBackButton.addEventListener("click", () => {
    showScreen(authScreenBox);
});

registerButton.addEventListener("click", async () => {
    const error = await register(registerNameInput.value, registerPasswordInput.value);
    if (error === "") {
        showMenu();
    } else {
        registerErrorText.textContent = error;
    }
});

loginButton.addEventListener("click", async () => {
    const error = await login(loginNameInput.value, loginPasswordInput.value);
    if (error === "") {
        showMenu();
    } else {
        loginErrorText.textContent = error;
    }
});
