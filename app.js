const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const number = document.querySelector("#number");
const button = document.querySelector("#button");
const winningScreen = document.querySelector("#winning-screen");
const winningText = document.querySelector("#winning-text");
const winningButton = document.querySelector("#play-again");
const audio = document.getElementById("audio");

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

//Audio
function playAudio() {
  audio.play();
}

//Timer
let time = 92;

function runTime() {
  time -= 1;
  let minutes = Math.floor(time / 60);
  let seconds = time - minutes * 60;
  if (seconds < 10) seconds = "0" + seconds;
  number.innerText = `${minutes}:${seconds}`;
}

// Variables for the player's dot
let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
const playerSize = 10;
const playerSpeed = 6;

// Variables for the other dots
const numDots = 12;
let dots = [];
const dotSize = 10;
let dotSpeed = 0.75;

// Initialize the dots
for (let i = 0; i < numDots; i++) {
  dots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: Math.random() * dotSpeed * 2 - dotSpeed,
    dy: Math.random() * dotSpeed * 2 - dotSpeed,
  });
}

//Increase Dot Speed OverTime
function runSpeedUpdate() {
  dotSpeed += 0.025;
  dots.forEach((dot) => {
    dot.dx = Math.random() * dotSpeed * 2 - dotSpeed;
    dot.dy = Math.random() * dotSpeed * 2 - dotSpeed;
  });
}

// Draw the player's dot
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(playerX, playerY, playerSize, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

// Draw all the dots
function drawDots() {
  dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  });
}

// Update the player's position based on mouse right-click
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  // Prevent the player's dot from going off the canvas
  if (mouseX < playerSize) {
    playerX = playerSize;
  } else if (mouseX > canvas.width - playerSize) {
    playerX = canvas.width - playerSize;
  } else {
    playerX = mouseX;
  }
  if (mouseY < playerSize) {
    playerY = playerSize;
  } else if (mouseY > canvas.height - playerSize) {
    playerY = canvas.height - playerSize;
  } else {
    playerY = mouseY;
  }
});

// Update the player's position based on mouse left-click
canvas.addEventListener("click", (e) => {
  e.preventDefault();
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  const mouseY = e.clientY - canvasRect.top;

  // Prevent the player's dot from going off the canvas
  if (mouseX < playerSize) {
    playerX = playerSize;
  } else if (mouseX > canvas.width - playerSize) {
    playerX = canvas.width - playerSize;
  } else {
    playerX = mouseX;
  }
  if (mouseY < playerSize) {
    playerY = playerSize;
  } else if (mouseY > canvas.height - playerSize) {
    playerY = canvas.height - playerSize;
  } else {
    playerY = mouseY;
  }
});


// Update the position of all the dots
function updateDots() {
  dots.forEach((dot) => {
    dot.x += dot.dx;
    dot.y += dot.dy;

    // Bounce off the walls
    if (dot.x < 0 || dot.x > canvas.width) {
      dot.dx = -dot.dx;
    }
    if (dot.y < 0 || dot.y > canvas.height) {
      dot.dy = -dot.dy;
    }
  });
}

function checkWin() { }

function checkCollisions() {
  dots.forEach((dot) => {
    const distance = Math.sqrt(
      (playerX - dot.x) ** 2 + (playerY - dot.y) ** 2
    );
    if (distance < playerSize + dotSize) {
      window.location.reload();
    } else if (distance > playerSize + dotSize && time <= 0) {
      winningScreen.removeAttribute("hidden");
      winningText.removeAttribute("hidden");
      container.setAttribute("hidden");
      dotSpeed = 0;
    }
  });
}

// Game loop
function gameLoap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  checkCollisions();
  drawDots();
  updateDots();
  window.requestAnimationFrame(gameLoop);
}

// Start the game loop
button.addEventListener("click", function () {
  setInterval(runTime, 1000);
  setInterval(runSpeedUpdate, 3050);
  playAudio();
  gameLoop();
});
