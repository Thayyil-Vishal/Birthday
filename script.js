const screens = [...document.querySelectorAll(".screen")];
const music = document.getElementById("birthdayMusic");
let musicStarted = false;

/* Every "next" button starts music after a real user gesture.
   If birthday-song.mp3 is not present, the page simply continues silently. */
function startMusic() {
  if (musicStarted || !music) return;
  music.play()
    .then(() => { musicStarted = true; })
    .catch(() => {});
}

function showScreen(number) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(`screen-${number}`);
  if (target) target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" });
  startMusic();
}

document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});


/* =========================================================
   FLOWER GAME
   7 MOVING FLOWERS + 15 SECOND TIMER
   ========================================================= */

const flowerGame = document.getElementById("flowerGame");
const flowerScore = document.getElementById("flowerScore");
const flowerTime = document.getElementById("flowerTime");
const startGameButton = document.getElementById("startGame");
const retryGameButton = document.getElementById("retryGame");
const flowerWinButton = document.getElementById("flowerWin");
const gameMessage = document.getElementById("gameMessage");

const FLOWERS_TO_CATCH = 7;
const GAME_SECONDS = 15;

let caughtFlowers = 0;
let timeLeft = GAME_SECONDS;
let timer = null;
let moveTimer = null;
let gameRunning = false;

const flowerTypes = ["🌸","🌺","🌼","🌷","💮","🌻","🌹"];

function randomPosition() {
  /* Keep the flower fully inside the game box. */
  return {
    x: 3 + Math.random() * 88,
    y: 7 + Math.random() * 78
  };
}

function moveFlower(flower) {
  if (!gameRunning || !flower.isConnected) return;

  const pos = randomPosition();
  flower.style.left = pos.x + "%";
  flower.style.top = pos.y + "%";
  flower.style.transform =
    `rotate(${Math.round(Math.random() * 26 - 13)}deg)`;
}

function createFlowers() {
  flowerGame.querySelectorAll(".flower").forEach(f => f.remove());

  for (let i = 0; i < FLOWERS_TO_CATCH; i++) {
    const flower = document.createElement("button");
    flower.type = "button";
    flower.className = "flower";
    flower.textContent = flowerTypes[i];
    flower.setAttribute("aria-label", "Catch flower");

    const pos = randomPosition();
    flower.style.left = pos.x + "%";
    flower.style.top = pos.y + "%";

    flower.addEventListener("click", () => {
      if (!gameRunning || flower.dataset.caught === "true") return;

      flower.dataset.caught = "true";
      flower.classList.add("caught");
      caughtFlowers++;
      flowerScore.textContent = caughtFlowers;

      if (caughtFlowers === FLOWERS_TO_CATCH) {
        winGame();
      }
    });

    flowerGame.appendChild(flower);
  }
}

function moveAllFlowers() {
  flowerGame.querySelectorAll(".flower").forEach(moveFlower);
}

function startGame() {
  startMusic();

  clearInterval(timer);
  clearInterval(moveTimer);

  caughtFlowers = 0;
  timeLeft = GAME_SECONDS;
  gameRunning = true;

  flowerScore.textContent = "0";
  flowerTime.textContent = GAME_SECONDS;
  gameMessage.textContent = "";

  startGameButton.classList.add("hidden");
  retryGameButton.classList.add("hidden");
  flowerWinButton.classList.add("hidden");

  createFlowers();

  /* They move repeatedly — this is the important part. */
  moveTimer = setInterval(moveAllFlowers, 850);

  timer = setInterval(() => {
    timeLeft--;
    flowerTime.textContent = timeLeft;

    if (timeLeft <= 0) {
      loseGame();
    }
  }, 1000);
}

function loseGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(timer);
  clearInterval(moveTimer);

  gameMessage.textContent =
    `Time's up! You caught ${caughtFlowers}/7. Give it another try 😄`;

  retryGameButton.classList.remove("hidden");
}

function winGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(timer);
  clearInterval(moveTimer);

  flowerTime.textContent = timeLeft;
  gameMessage.textContent = "All 7! Okay, you earned something. 🌻";

  flowerWinButton.classList.remove("hidden");

  /* Little celebration immediately after winning. */
  confetti(100);
}

startGameButton.addEventListener("click", startGame);
retryGameButton.addEventListener("click", startGame);

flowerWinButton.addEventListener("click", () => {
  showScreen(4);
});


/* =========================================================
   CONFETTI
   ========================================================= */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationFrame = null;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function confetti(count = 90) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: window.innerWidth / 2 + (Math.random() - .5) * 160,
      y: window.innerHeight * .35 + (Math.random() - .5) * 80,
      vx: (Math.random() - .5) * 8,
      vy: -Math.random() * 8 - 2,
      gravity: .16 + Math.random() * .12,
      size: 3 + Math.random() * 5,
      opacity: 1
    });
  }

  if (!animationFrame) animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces.forEach(piece => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += piece.gravity;
    piece.opacity -= .007;

    ctx.globalAlpha = Math.max(0, piece.opacity);

    const colors = ["#ffd77e","#e8b4ff","#ff91c9","#ffffff"];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

    ctx.fillRect(
      piece.x,
      piece.y,
      piece.size,
      piece.size * 1.8
    );
  });

  pieces = pieces.filter(piece =>
    piece.opacity > 0 &&
    piece.y < window.innerHeight + 40
  );

  animationFrame = pieces.length
    ? requestAnimationFrame(animateConfetti)
    : null;
}


/* =========================================================
   BHARAT MATA KI JAI — RESPECTFUL + FUN
   ========================================================= */

const jaiButton = document.getElementById("jaiButton");
const jaiReaction = document.getElementById("jaiReaction");

jaiButton.addEventListener("click", () => {
  jaiReaction.textContent = "😂 Yep. We remember that one!";
  confetti(110);
});


/* =========================================================
   REPLAY
   ========================================================= */

document.getElementById("replay").addEventListener("click", () => {
  clearInterval(timer);
  clearInterval(moveTimer);

  caughtFlowers = 0;
  timeLeft = GAME_SECONDS;
  gameRunning = false;

  flowerScore.textContent = "0";
  flowerTime.textContent = GAME_SECONDS;
  gameMessage.textContent = "";

  startGameButton.classList.remove("hidden");
  retryGameButton.classList.add("hidden");
  flowerWinButton.classList.add("hidden");

  showScreen(1);
});
