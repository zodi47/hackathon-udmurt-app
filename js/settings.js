// поиск элементов

const soundCheckbox = document.getElementById("toggle-sound");
const notificationsCheckbox = document.getElementById("toggle-notifications");
const geolocationCheckbox = document.getElementById("toggle-geolocation");
const toMainButton = document.getElementById("to-main");


// функции

//включен ли переключатель
function isOn(key) {
    return localStorage.getItem(key) === "true";
}

//сохранение и показ состояния переключателя
function setState(key, checkbox, on) {
    checkbox.checked = on;
    localStorage.setItem(key, on);
}


// показываем сохраненные состояния
setState("sound", soundCheckbox, isOn("sound"));
setState("notifications", notificationsCheckbox, isOn("notifications"));
setState("geolocation", geolocationCheckbox, isOn("geolocation"));


// обработчики переключателей

soundCheckbox.addEventListener("change", () => {
    setState("sound", soundCheckbox, soundCheckbox.checked);
});

notificationsCheckbox.addEventListener("change", async () => {
    if (!notificationsCheckbox.checked) {
        setState("notifications", notificationsCheckbox, false);
        return;
    }

    if (!("Notification" in window)) {
        alert("Этот браузер не поддерживает уведомления");
        setState("notifications", notificationsCheckbox, false);
        return;
    }

    // спрашиваем разрешение
    const permission = await Notification.requestPermission();
    setState("notifications", notificationsCheckbox, permission === "granted");
});

geolocationCheckbox.addEventListener("change", () => {
    if (!geolocationCheckbox.checked) {
        setState("geolocation", geolocationCheckbox, false);
        return;
    }

    // спрашиваем разрешение
    navigator.geolocation.getCurrentPosition(
        () => setState("geolocation", geolocationCheckbox, true),
        () => setState("geolocation", geolocationCheckbox, false)
    );
});

toMainButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});
