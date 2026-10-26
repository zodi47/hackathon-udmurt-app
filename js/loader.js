//загрузка слов из json
export async function loadJson() {
    const response = await fetch("../data/words.json");
    if (response.ok) {
        const vocabulary = await response.json();
        return(vocabulary);
    }

    else {
        console.log("файл json не найден")
    }
}