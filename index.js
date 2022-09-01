import questions from "./data.js";
const questionEl = document.getElementById("question-el");
const optionsBtn = document.getElementById("options-btn");
const closeBtn = document.getElementById("close-btn");
const answers = document.getElementsByClassName("answer-btn");
const correctAu = new Audio("audio/correct.wav");
const wrongAu = new Audio("audio/wrong.wav");

let canAnswer = true;
let rightBtn;

const reversed = Object.fromEntries(Object.entries(questions).map(([key, value]) => [value, key]));

const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
};

function newQuestion() {
    let question = Math.floor(Math.random() * 71);
    rightBtn = Math.floor(Math.random() * 4);
    let copy = JSON.parse(JSON.stringify(Object.values(questions)));
    copy.splice(question, 1);
    for (let i = 0; i < 4; i++) {
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

    setTimeout(function () {
        newQuestion();
        canAnswer = true;
    }, 500);
}

for (let i = 0; i < 4; i++) {
    let currentBtn = answers[i];
    currentBtn.addEventListener("click", () => {
        if (canAnswer) {
            currentBtn.id == rightBtn ? answer(true) : answer(false);
        }
    });
}

optionsBtn.addEventListener("click", function () {
    overlay.style.display = "flex";
});
closeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
});

window.addEventListener("resize", documentHeight);
window.addEventListener("orientationchange", documentHeight);

newQuestion();
documentHeight();
