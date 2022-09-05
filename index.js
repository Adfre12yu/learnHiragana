import questions from "./data.js";
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
const regex = /^#(?:[0-9a-f]{6})$/i;
const correctAu = new Audio("audio/correct.wav");
const wrongAu = new Audio("audio/wrong.wav");
let canAnswer = true;
let rightBtn = 0;

const reversed = Object.fromEntries(Object.entries(questions).map(([key, value]) => [value, key]));

const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};

function newQuestion() {
    answers[rightBtn].style.boxShadow = "none";
    let question = Math.floor(Math.random() * 71);
    rightBtn = Math.floor(Math.random() * 4);
    let copy = JSON.parse(JSON.stringify(Object.values(questions)));
    copy.splice(question, 1);
    for (let i = 0; i < 4; i++) {
        answers[i].style.opacity = "100%";
        if (i == rightBtn) {
            answers[i].textContent = Object.values(questions)[question];
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

function changeColor(input, swatch, calledFromInput, value) {
    if (calledFromInput) {
        if (!regex.test(input.value)) {
            error.style.display = "block";
            setTimeout(() => {
                error.style.display = "none";
            }, 1500);
        } else {
            swatch.value = input.value;
            document.documentElement.style.setProperty(value, input.value);
            localStorage.setItem(value, input.value);
        }
    } else {
        input.value = swatch.value;
        document.documentElement.style.setProperty(value, input.value);
        localStorage.setItem(value, input.value);
    }
}

function loadColor() {
    localStorage.getItem("--main-color") != null
        ? document.documentElement.style.setProperty(
              "--main-color",
              localStorage.getItem("--main-color")
          )
        : null;
    localStorage.getItem("--secondary-color") != null
        ? document.documentElement.style.setProperty(
              "--secondary-color",
              localStorage.getItem("--secondary-color")
          )
        : null;
    localStorage.getItem("--text-color") != null
        ? document.documentElement.style.setProperty(
              "--text-color",
              localStorage.getItem("--text-color")
          )
        : null;
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

optionsBtn.addEventListener("click", function () {
    overlay.style.visibility = "visible";
    overlay.style.opacity = 1;
});
closeBtn.addEventListener("click", function () {
    overlay.style.opacity = 0;
    overlay.style.visibility = "hidden";
});
resetBtn.addEventListener("click", () => {
    document.documentElement.style.setProperty("--main-color", "#ff7676");
    document.documentElement.style.setProperty("--secondary-color", "#ff5454");
    document.documentElement.style.setProperty("--text-color", "#ffffff");
    localStorage.setItem("--main-color", "#ff7676");
    localStorage.setItem("--secondary-color", "#ff5454");
    localStorage.setItem("--text-color", "#ffffff");
});

window.addEventListener("resize", documentHeight);
window.addEventListener("orientationchange", documentHeight);

loadColor();
newQuestion();
documentHeight();
