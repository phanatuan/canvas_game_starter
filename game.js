let canvas, ctx;
let timeStart, timeEnd, totalTime;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  heroImage = new Image();
  heroImage.onload = function() {
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function() {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

generateLocation = canvas => {
  let x = Math.random() * canvas.width + 1;
  let y = Math.random() * canvas.height + 1;
  return { x, y };
};

let monsterX = 100;
let monsterY = 100;
let countMonsterCaught = 0;

// Keyboard Listeners
let keysDown = {};
function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function(key) {
      if (!timeStart) {
        timeStart = performance.now();
        console.log(timeStart);
      }
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

const update = () => {
  if (38 in keysDown) {
    //UP
    heroY -= 2;
  }
  if (40 in keysDown) {
    //DOWN
    heroY += 2;
  }
  if (37 in keysDown) {
    //LEFT
    heroX -= 2;
  }
  if (39 in keysDown) {
    //RIGHT
    heroX += 2;
  }

  // Check if player and monster collided
  if (
    heroX <= monsterX + 32 &&
    monsterX <= heroX + 32 &&
    heroY <= monsterY + 32 &&
    monsterY <= heroY + 32
  ) {
    ctx.strokeText("Monster Caught:", 100, 300);
    // Pick a new location for the monster.
    if (countMonsterCaught > 3) {
      timeEnd = performance.now();
      totalTime = timeEnd - timeStart;
      gameOver();
    } else {
      countMonsterCaught++;
      let { x, y } = generateLocation(canvas); // destructuring
      monsterX = x; //generate new location for Monster
      monsterY = y;
    }
  }
};

const gameOver = () => {
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`Game Over`, canvas.width / 2, canvas.length / 2);
  countMonsterCaught = 0;
};

const render = function() {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }

  //Display Count of Monster Caught
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText(`Score: ${countMonsterCaught}`, 20, 20);
  
  if (countMonsterCaught > 1) {
    ctx.fillText(
      `You Win. Congratulations`,
      cavas.width / 2,
      canvas.height / 2
    );
  }
  // if (totalTime > 0) {
  // ctx.fillText(`${(totalTime / 1000).toFixed(2)} seconds`, 300, 20);
  // }
};

//The main game loop.
//update + render

let main = function() {
  update();
  render();
  requestAnimationFrame(main); // Request to do this again ASAP.
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
const startGame = () => {
  loadImages();
  setupKeyboardListeners();
  main();
};

startGame();


