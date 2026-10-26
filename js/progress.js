// прогресс в играх
import {initDb, findUser, saveProgress, getProgress} from "./db.js";
import {getCurrentUser} from "./account.js";


//id пользователя, который вошел
async function getUserId() {
    const name = getCurrentUser();
    if (name === null) {
        return null;
    }

    await initDb();
    const user = findUser(name);
    if (user === null) {
        return null;
    }
    return user.id;
}

//сохранение результата игры
export async function saveGameResult(game, themeId, score, total) {
    const userId = await getUserId();
    if (userId === null) {
        return;
    }

    saveProgress(userId, game, themeId, score, total);
    document.dispatchEvent(new Event("progress-saved")); // сообщаем что прогресс изменился
}

//результаты в игре по всем пройденным темам
export async function getGameResults(game) {
    const userId = await getUserId();
    if (userId === null) {
        return [];
    }
    return getProgress(userId, game);
}
