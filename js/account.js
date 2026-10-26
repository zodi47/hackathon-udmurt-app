// правила аккаунта - регистрация, вход, смена пароля
import {initDb, findUser, addUser, updatePassword} from "./db.js";


//кто сейчас
export function getCurrentUser() {
    return sessionStorage.getItem("currentUser");
}

//запоминаем кто вошел
function setCurrentUser(name) {
    sessionStorage.setItem("currentUser", name);
}

//выход из аккаунта
export function logout() {
    sessionStorage.removeItem("currentUser");
}

//проверка пароля
function checkPassword(password) {
    if (password.length < 8) {
        return "Пароль должен быть не короче 8 символов";
    }
    if (/[а-яё]/i.test(password)) {
        return "В пароле не должно быть русских букв";
    }
    return "";
}



//регистрация
export async function register(name, password) {
    name = name.trim();
    if (name === "") {
        return "Введите имя пользователя";
    }

    const passwordError = checkPassword(password);
    if (passwordError !== "") {
        return passwordError;
    }

    await initDb();
    if (findUser(name) !== null) {
        return "Такое имя уже занято";
    }

    addUser(name, password);
    setCurrentUser(name);
    return "";
}

//вход
export async function login(name, password) {
    name = name.trim();

    await initDb();
    const user = findUser(name);
    if (user === null || user.password !== password) {
        return "Неверное имя или пароль";
    }

    setCurrentUser(user.name);
    return "";
}

//смена пароля
export async function changePassword(oldPassword, newPassword) {
    const name = getCurrentUser();

    await initDb();
    const user = findUser(name);
    if (user === null || user.password !== oldPassword) {
        return "Старый пароль неверный";
    }

    const passwordError = checkPassword(newPassword);
    if (passwordError !== "") {
        return passwordError;
    }

    updatePassword(name, newPassword);
    return "";
}
