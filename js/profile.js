import {showScreen} from "./utils.js";
import {getCurrentUser, changePassword} from "./account.js";

// поиск элементов

const profileScreenBox = document.getElementById("profile-screen"); // экран профиля
const nameText = document.getElementById("profile-name");
const openChangePasswordButton = document.getElementById("open-change-password");
const toMainButton = document.getElementById("to-main");

const passwordScreenBox = document.getElementById("password-screen"); // экран смены пароля
const oldPasswordInput = document.getElementById("old-password");
const newPasswordInput = document.getElementById("new-password");
const passwordMessageText = document.getElementById("password-message");
const savePasswordButton = document.getElementById("save-password");
const passwordBackButton = document.getElementById("password-back");


// показ имени пользователя
const userName = getCurrentUser();
if (userName === null) {
    nameText.textContent = "вы не вошли";
    openChangePasswordButton.hidden = true;
} else {
    nameText.textContent = userName;
}


// обработчики кнопок

openChangePasswordButton.addEventListener("click", () => {
    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    passwordMessageText.textContent = "";
    showScreen(passwordScreenBox);
});

savePasswordButton.addEventListener("click", async () => {
    const error = await changePassword(oldPasswordInput.value, newPasswordInput.value);
    if (error === "") {
        oldPasswordInput.value = "";
        newPasswordInput.value = "";
        passwordMessageText.textContent = "Пароль изменен";
    } else {
        passwordMessageText.textContent = error;
    }
});

passwordBackButton.addEventListener("click", () => {
    showScreen(profileScreenBox);
});

toMainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});
