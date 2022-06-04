"use strict";

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  if (!guess) {
    displaySMS("message", "⛔ No Number");
  } else if (guess === secretNumber) {
    displaySMS("box", secretNumber);
    displaySMS("message", "✅ Correct Number!");
    document.querySelector("body").style.background = "#60b347";
    if (score > highscore) {
      highscore = score;
      displaySMS("highscore", highscore);
    } else {
      highscore = highscore;
      displaySMS("highscore", highscore);
    }
  } else if (guess != secretNumber) {
    if (score > 1) {
      guess > secretNumber
        ? displaySMS("message", "📈 Too High")
        : displaySMS("message", "📉 Too Low");
      score--;
      displaySMS("score", score);
    } else {
      displaySMS("message", "🚒 You Lose the Game");
      displaySMS("score", 0);
    }
  }
});
document.querySelector(".btn").addEventListener("click", function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector(".guess").value = "";
  displaySMS("box", "?");
  displaySMS("message", "Start guessing...");
  displaySMS("score", score);
  document.querySelector("body").style.background = "#222";
});

//displaying Function any message
const displaySMS = (query, sms) => {
  document.querySelector("." + query).textContent = sms;
};
