import data from "./data.js";
import questions from "./data.js";
import questionsKata from "./katakana-data.js";
const questionEl = document.getElementById("question-el");
const optionsBtn = document.getElementById("options-btn");
const closeBtn = document.getElementById("close-btn");
const answers = document.getElementsByClassName("answer-btn");
const bgColor = document.getElementById("bg-color");
const bgColorSwatch = document.getElementById("bg-color-swatch");
const secColor = document.getElementById("sec-color");
const secColorSwatch = document.getElementById("sec-color-swatch");
const txtColor = document.getElementById("txt-color");
const txtColorSwatch = document.getElementById("txt-color-swatch");
const resetBtn = document.getElementById("reset-btn");
const error = document.getElementById("error");
const katakanaToggle = document.getElementById("katakana-toggle");
const flipperToggle = document.getElementById("flipper-toggle");
const regex = /^#(?:[0-9a-f]{6})$/i;
const correctAu = new Audio("audio/correct.wav");
const wrongAu = new Audio("audio/wrong.wav");
let canAnswer = true;
let rightBtn = 0;
let dataset = questions;

let reversed = Object.fromEntries(Object.entries(questions).map(([key, value]) => [value, key]));
const reversedKata = Object.fromEntries(
    Object.entries(questionsKata).map(([key, value]) => [value, key])
);

const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${doc.clientHeight}px`);
};

function newQuestion() {
    answers[rightBtn].style.boxShadow = "none";
    let question = Math.floor(Math.random() * Object.values(dataset).length);
    rightBtn = Math.floor(Math.random() * 4);
    let copy = JSON.parse(JSON.stringify(Object.values(dataset)));
    copy.splice(question, 1);
    for (let i = 0; i < 4; i++) {
        answers[i].style.opacity = "100%";
        if (i == rightBtn) {
            answers[i].textContent = Object.values(dataset)[question];
        } else {
            let wrongAnswer = Math.floor(Math.random() * copy.length);
            answers[i].textContent = copy[wrongAnswer];
            copy.splice(wrongAnswer, 1);
        }
    }
    questionEl.textContent = reversed[answers[rightBtn].textContent];
}

function answer(correct) {
    canAnswer = false;

    correct ? correctAu.play() : wrongAu.play();
    for (let i = 0; i < 4; i++) {
        i != rightBtn ? (answers[i].style.opacity = "40%") : null;
    }
    answers[rightBtn].style.boxShadow = "0px 0px 40px 7px rgba(0, 0, 0, 0.1)";
    setTimeout(() => {
        newQuestion();
        canAnswer = true;
    }, 600);
}

function loadDataset(data) {
    localStorage.setItem("katakana", katakanaToggle.checked);
    localStorage.setItem("flipped", flipperToggle.checked);
    if (!flipperToggle.checked) {
        dataset = data;
        reversed = Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
    } else {
        dataset = Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
        reversed = data;
    }
    loadColor();
    newQuestion();
}

function changeColor(input, swatch, calledFromInput, value) {
    if (calledFromInput) {
        if (!regex.test(input.value)) {
            error.style.display = "block";
            setTimeout(() => {
                error.style.display = "none";
            }, 3000);
        } else {
            localStorage.setItem(value, input.value);
            loadColor();
        }
    } else {
        localStorage.setItem(value, swatch.value);
        loadColor();
    }
}

function loadColor() {
    let mainColor =
        localStorage.getItem("--main-color") != null
            ? localStorage.getItem("--main-color")
            : katakanaToggle.checked
            ? "#45b8f5"
            : "#ff7676";
    document.documentElement.style.setProperty("--main-color", mainColor);
    bgColor.value = mainColor;
    bgColorSwatch.value = mainColor;
    bgColorSwatch.style.borderColor = hexToHSL(mainColor);

    let secondaryColor =
        localStorage.getItem("--secondary-color") != null
            ? localStorage.getItem("--secondary-color")
            : katakanaToggle.checked
            ? "#21aaf3"
            : "#ff5454";
    document.documentElement.style.setProperty("--secondary-color", secondaryColor);
    secColor.value = secondaryColor;
    secColorSwatch.value = secondaryColor;
    secColorSwatch.style.borderColor = hexToHSL(secondaryColor);

    let textColor =
        localStorage.getItem("--text-color") != null
            ? localStorage.getItem("--text-color")
            : "#ffffff";
    document.documentElement.style.setProperty("--text-color", textColor);
    txtColor.value = textColor;
    txtColorSwatch.value = textColor;
    txtColorSwatch.style.borderColor = hexToHSL(textColor);

    katakanaToggle.checked = JSON.parse(localStorage.getItem("katakana"));
    flipperToggle.checked = JSON.parse(localStorage.getItem("flipped"));
}

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0,
        g = 0,
        b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1) - 40;
    l = +(l * 100).toFixed(1) - 20;

    return "hsl(" + h + "," + s + "%," + l + "%)";
}

for (let i = 0; i < 4; i++) {
    let currentBtn = answers[i];
    currentBtn.addEventListener("click", () => {
        if (canAnswer) {
            currentBtn.id == rightBtn ? answer(true) : answer(false);
        }
    });
}

bgColorSwatch.addEventListener("change", () => {
    changeColor(bgColor, bgColorSwatch, false, "--main-color");
});

bgColor.addEventListener("change", () => {
    changeColor(bgColor, bgColorSwatch, true, "--main-color");
});

secColorSwatch.addEventListener("change", () => {
    changeColor(secColor, secColorSwatch, false, "--secondary-color");
});

secColor.addEventListener("change", () => {
    changeColor(secColor, secColorSwatch, true, "--secondary-color");
});

txtColorSwatch.addEventListener("change", () => {
    changeColor(txtColor, txtColorSwatch, false, "--text-color");
});

txtColor.addEventListener("change", () => {
    changeColor(txtColor, txtColorSwatch, true, "--text-color");
});

katakanaToggle.addEventListener("change", () => {
    katakanaToggle.checked ? loadDataset(questionsKata) : loadDataset(questions);
});

flipperToggle.addEventListener("change", () => {
    katakanaToggle.checked ? loadDataset(questionsKata) : loadDataset(questions);
});

optionsBtn.addEventListener("click", function () {
    overlay.style.visibility = "visible";
    overlay.style.opacity = 1;
});
closeBtn.addEventListener("click", function () {
    overlay.style.opacity = 0;
    overlay.style.visibility = "hidden";
});
resetBtn.addEventListener("click", () => {
    localStorage.setItem("--main-color", "#ff7676");
    localStorage.setItem("--secondary-color", "#ff5454");
    localStorage.setItem("--text-color", "#ffffff");
    localStorage.setItem("katakana", false);
    localStorage.setItem("flipped", false);

    loadColor();
    localStorage.removeItem("--main-color");
    localStorage.removeItem("--secondary-color");
    localStorage.removeItem("--text-color");
});

window.addEventListener("resize", documentHeight);

katakanaToggle.checked ? loadDataset(questionsKata) : loadDataset(questions);
loadColor();
newQuestion();
documentHeight();
