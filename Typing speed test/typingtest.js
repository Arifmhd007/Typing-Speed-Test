const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const timeSelect = document.getElementById("time-select");
const progressBar = document.getElementById("progress-bar");

let totalTime = 60;
let timeLeft = 60;
let timer;
let isRunning = false;
let correctChars = 0;
let incorrectChars = 0;
let totalChars = 0;
let startTime;
let targetText = "";
let currentIndex = 0; 

const texts = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast requires focus and practice every day.",
  "JavaScript makes web pages interactive and dynamic.",
  "Coding challenges improve your problem-solving skills.",
  "My sister has already made a big cake.",
  "I have known Michael since high school.",
  "My baby has slept since all night.",
  "I have studied at home for one hour.",
  "He has never eaten these pizzas.",
  "Scientists have split the atom.",
  "Have you ever stayed in a hotel?",
  "My dogs have not eaten anything.",
  "The hens have laid plenty of eggs.",
  "He has entered in a restaurant.",
  "How long have you lived in this city?",
  "Have you ever played basketball?",
  "I have put the money on the table.",
  "She hasn't slept since yesterday.",
  "My brother has driven a car before.",
  "I have made you a cup of coffee.",
  "The class has been outside for recess.",
  "We haven't gone to watch the new movie.",
  "My mother has just cleaned the house.",
  "My son has been sick since Monday.",
  "I've known Mark for 7 or 8 years.",
  "My brothers haven't ever gone to Spain.",
  "Nobody has ever said that to me before.",
  "Samuel hasn't called for eight months.",
  "George has never traveled with a train.",
  "I have never seen a famous person.",
  "I've visited four of our clients today.",
  "I have already ironed the shirts."
];

function getRandomText() {
  return texts[Math.floor(Math.random() * texts.length)];
}

function loadNewSentence() {
  targetText = getRandomText();
  textDisplay.classList.remove("fade-in");
  void textDisplay.offsetWidth;
  textDisplay.classList.add("fade-in");

  textDisplay.innerHTML = "";
  targetText.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    textDisplay.appendChild(span);
  });
  textInput.value = "";
  currentIndex = 0; 
}

function startTest() {
  if (isRunning) return;
  isRunning = true;

  totalTime = parseInt(timeSelect.value);
  timeLeft = totalTime;

  correctChars = 0;
  incorrectChars = 0;
  totalChars = 0;
  textInput.value = "";
  textInput.disabled = false;
  textInput.focus();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  timeSelect.disabled = true;
  wpmDisplay.innerText = "0";
  accuracyDisplay.innerText = "100";
  progressBar.style.width = "100%";

  loadNewSentence();
  startTime = new Date();
  updateTimerDisplay();
  timer = setInterval(updateTimer, 1000);
}

function stopTest() {
  if (!isRunning) return;
  endTest();
}

function resetTest() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = parseInt(timeSelect.value);
  updateTimerDisplay();
  textInput.value = "";
  textInput.disabled = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  timeSelect.disabled = false;
  progressBar.style.width = "100%";

  wpmDisplay.innerText = "0";
  accuracyDisplay.innerText = "100";
  textDisplay.innerHTML = "";
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
    const percent = (timeLeft / totalTime) * 100;
    progressBar.style.width = percent + "%";
  } else {
    endTest();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function endTest() {
  clearInterval(timer);
  isRunning = false;
  textInput.disabled = true;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  timeSelect.disabled = false;

  const elapsedTime = (new Date() - startTime) / 1000 / 60;
  const words = correctChars / 5;
  const wpm = Math.round(words / elapsedTime);
  const accuracy = totalChars ? Math.round((correctChars / totalChars) * 100) : 100;

  wpmDisplay.innerText = isNaN(wpm) ? 0 : wpm;
  accuracyDisplay.innerText = accuracy;

  const correctWords = Math.floor(correctChars / 5);
  const incorrectWords = Math.floor(incorrectChars / 5);

  document.getElementById("correct-letters").innerText = correctChars;
  document.getElementById("incorrect-letters").innerText = incorrectChars;
  document.getElementById("correct-words").innerText = correctWords;
  document.getElementById("incorrect-words").innerText = incorrectWords;
  document.getElementById("final-wpm").innerText = wpm;
  document.getElementById("final-accuracy").innerText = accuracy;

  document.getElementById("result-modal").classList.remove("hidden");
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("result-modal").classList.add("hidden");
});

textInput.addEventListener("input", () => {
  const arrayText = textDisplay.querySelectorAll("span");
  const value = textInput.value;

  const newChar = value[value.length - 1];
  const expectedChar = targetText[currentIndex];

  if (newChar == null) return;

  totalChars++;

  if (newChar === expectedChar) {
    correctChars++;
    arrayText[currentIndex].classList.add("correct");
  } else {
    incorrectChars++;
    arrayText[currentIndex].classList.add("incorrect");
  }

  currentIndex++;


  if (currentIndex === targetText.length) {
    loadNewSentence();
  }
});

startBtn.addEventListener("click", startTest);
stopBtn.addEventListener("click", stopTest);
resetBtn.addEventListener("click", resetTest);
