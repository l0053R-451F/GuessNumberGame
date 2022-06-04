"use strict";

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;
// document.querySelector(".box").textContent = secretNumber;
document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);

  if (!guess) {
    document.querySelector(".message").textContent = "⛔ No Number";
  } else if (guess === secretNumber) {
    document.querySelector(".box").textContent = secretNumber;
    document.querySelector(".message").textContent = "✅ Correct Number!";
    document.querySelector("body").style.background = "#60b347";
    if (score > highscore) {
      highscore = score;
      document.querySelector(".highscore").textContent = highscore;
    } else {
      highscore = highscore;
      document.querySelector(".highscore").textContent = highscore;
    }
  } else if (guess != secretNumber) {
    if (score > 1) {
      // document.querySelector(".message").textContent = "📈 Too High";
      guess > secretNumber
        ? (document.querySelector(".message").textContent = "📈 Too High")
        : (document.querySelector(".message").textContent = "📈 Too Low");
      score--;
      document.querySelector(".score").textContent = score;
    } else {
      document.querySelector(".message").textContent = "🚒 You Lose the Game";
      document.querySelector(".score").textContent = 0;
    }
  }

  // } else if (guess > secretNumber) {
  //   if (score > 1) {
  //     document.querySelector(".message").textContent = "📈 Too High";
  //     score--;
  //     document.querySelector(".score").textContent = score;
  //   } else {
  //     document.querySelector(".message").textContent = "🚒 You Lose the Game";
  //     document.querySelector(".score").textContent = 0;
  //   }
  // } else if (guess < secretNumber) {
  //   if (score > 1) {
  //     document.querySelector(".message").textContent = "📉 Too Low";
  //     score--;
  //     document.querySelector(".score").textContent = score;
  //   } else {
  //     document.querySelector(".message").textContent = "🚒 You Lose the Game";
  //     document.querySelector(".score").textContent = 0;
  //   }
  // }
});
document.querySelector(".btn").addEventListener("click", function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector(".box").textContent = "?";
  document.querySelector(".guess").textContent = 0;
  document.querySelector(".message").textContent = "Start guessing...";
  document.querySelector(".score").textContent = score;
  document.querySelector("body").style.background = "#222";
});
