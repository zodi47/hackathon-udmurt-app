//перемешивание (возвращает новый массив, исходный не меняется)
export function shuffle(array) {
    const copy = array.slice();
    copy.sort(() => Math.random() - 0.5);
    return copy;
}

//показ экрана
export function showScreen(item) {
    const screens = document.querySelectorAll("main section");
    for (const screen of screens) {
        screen.hidden = true;
    }
    item.hidden = false;
}

//перезапуск css-анимации появления (сама анимация .appear описана в style.css)
export function replayAnimation(item) {
    item.classList.remove("appear");
    void item.offsetWidth; // заставляет браузер "заметить" снятие класса
    item.classList.add("appear");
}
