// работа с бд

let db; // база данных
const storageKey = "udmurt-db"; // под этим именем бд хранится в браузере


//открытие бд
export async function initDb() {
    if (db) {
        return;
    }

    const libUrl = new URL("../lib/", import.meta.url).href; // папка с sql-wasm.wasm
    const SQL = await initSqlJs({locateFile: file => libUrl + file});

    const saved = localStorage.getItem(storageKey);
    if (saved) {
        db = new SQL.Database(new Uint8Array(JSON.parse(saved)));
    } else {
        db = new SQL.Database();
    }

// таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        name_lower TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);

// лучший результат пользователя в каждой теме каждой игры
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        user_id INTEGER NOT NULL REFERENCES users(id),
        game TEXT NOT NULL,
        theme_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        PRIMARY KEY (user_id, game, theme_id)
    )`);
}

//сохранение базы
function saveDb() {
    const bytes = db.export();
    localStorage.setItem(storageKey, JSON.stringify(Array.from(bytes)));
}


//поиск пользователя по имени
export function findUser(name) {
    const statement = db.prepare("SELECT id, name, password FROM users WHERE name_lower = ?");
    statement.bind([name.toLowerCase()]);

    let user = null;
    if (statement.step()) {
        user = statement.getAsObject();
    }
    statement.free();
    return user;
}

//добавление пользователя
export function addUser(name, password) {
    db.run("INSERT INTO users (name, name_lower, password) VALUES (?, ?, ?)", [name, name.toLowerCase(), password]);
    saveDb();
}

//смена пароля
export function updatePassword(name, password) {
    db.run("UPDATE users SET password = ? WHERE name_lower = ?", [password, name.toLowerCase()]);
    saveDb();
}

//сохранение результата (если в теме у пользователя уже был результат лучше, то он и остается)
export function saveProgress(userId, game, themeId, score, total) {
    db.run(`INSERT INTO progress (user_id, game, theme_id, score, total) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (user_id, game, theme_id) DO UPDATE SET score = MAX(score, excluded.score), total = excluded.total`,
        [userId, game, themeId, score, total]);
    saveDb();
}

//результаты пользователя в игре
export function getProgress(userId, game) {
    const statement = db.prepare("SELECT theme_id, score, total FROM progress WHERE user_id = ? AND game = ?");
    statement.bind([userId, game]);

    const results = [];
    while (statement.step()) {
        results.push(statement.getAsObject());
    }
    statement.free();
    return results;
}
