const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const levelElement = document.getElementById("level-display");
const btnPause = document.getElementById("btn-pause");

const grid = 20;
let count = 0;
let score = 0;
let level = 1;
let isPaused = false;
let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

// Definición de obstáculos para el Nivel 2
let obstacles = [];

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = { x: 320, y: 320 };

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Genera obstáculos respetando la posición inicial y la manzana
function generateObstacles() {
  obstacles = [];
  const obstacleCount = 6;
  for (let i = 0; i < obstacleCount; i++) {
    let obsX, obsY;
    do {
      obsX = getRandomInt(0, canvas.width / grid) * grid;
      obsY = getRandomInt(0, canvas.height / grid) * grid;
    } while (
      (obsX === snake.x && obsY === snake.y) ||
      (obsX === apple.x && obsY === apple.y)
    );
    obstacles.push({ x: obsX, y: obsY });
  }
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  score = 0;
  level = 1;
  obstacles = [];
  if (levelElement) levelElement.innerText = `Nivel: ${level}`;
  scoreElement.innerText = score;
  spawnApple();
}

function spawnApple() {
  let validPosition = false;
  while (!validPosition) {
    apple.x = getRandomInt(0, canvas.width / grid) * grid;
    apple.y = getRandomInt(0, canvas.height / grid) * grid;
    
    // Verificar que la manzana no aparezca sobre obstáculos
    validPosition = !obstacles.some(obs => obs.x === apple.x && obs.y === apple.y);
  }
}

// Alternar pausa
function togglePause() {
  isPaused = !isPaused;
  if (btnPause) {
    btnPause.innerText = isPaused ? "Reanudar" : "Pausar";
  }
}

// Renderizado detallado de la Manzana
function drawApple(x, y) {
  const radius = grid / 2;
  const centerX = x + radius;
  const centerY = y + radius;

  // Cuerpo de la manzana
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(centerX, centerY + 1, radius - 2, 0, Math.PI * 2);
  ctx.fill();

  // Tallo
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 4);
  ctx.lineTo(centerX + 2, centerY - 8);
  ctx.stroke();

  // Hoja
  ctx.fillStyle = "#2ecc71";
  ctx.beginPath();
  ctx.ellipse(centerX + 3, centerY - 7, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
}

// Bucle principal del juego
function loop() {
  requestAnimationFrame(loop);

  if (isPaused) return;

  // Aumento de velocidad según el nivel (Level 1: 6 frames delay, Level 2: 4 frames delay)
  const speed = level === 1 ? 6 : 4;
  if (++count < speed) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // Envolver serpiente en bordes
  if (snake.x < 0) snake.x = canvas.width - grid;
  else if (snake.x >= canvas.width) snake.x = 0;

  if (snake.y < 0) snake.y = canvas.height - grid;
  else if (snake.y >= canvas.height) snake.y = 0;

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Dibujar Manzana
  drawApple(apple.x, apple.y);

  // Dibujar Obstáculos (Nivel 2)
  if (level === 2) {
    ctx.fillStyle = "#7f8c8d";
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x + 1, obs.y + 1, grid - 2, grid - 2);
    });
  }

  // Dibujar Serpiente
  snake.cells.forEach((cell, index) => {
    const isHead = index === 0;
    const isTail = index === snake.cells.length - 1;
    const centerX = cell.x + grid / 2;
    const centerY = cell.y + grid / 2;

    if (isHead) {
      // Cabeza
      ctx.fillStyle = "#27ae60";
      ctx.beginPath();
      ctx.arc(centerX, centerY, grid / 2, 0, Math.PI * 2);
      ctx.fill();

      // Ojos y Lengua orientados a la dirección
      ctx.fillStyle = "#ffffff";
      let eyeX1, eyeY1, eyeX2, eyeY2;
      let tongueEndX, tongueEndY;

      if (snake.dx > 0) { // Derecha
        eyeX1 = cell.x + 13; eyeY1 = cell.y + 5;
        eyeX2 = cell.x + 13; eyeY2 = cell.y + 15;
        tongueEndX = cell.x + 24; tongueEndY = centerY;
      } else if (snake.dx < 0) { // Izquierda
        eyeX1 = cell.x + 7; eyeY1 = cell.y + 5;
        eyeX2 = cell.x + 7; eyeY2 = cell.y + 15;
        tongueEndX = cell.x - 4; tongueEndY = centerY;
      } else if (snake.dy < 0) { // Arriba
        eyeX1 = cell.x + 5; eyeY1 = cell.y + 7;
        eyeX2 = cell.x + 15; eyeY2 = cell.y + 7;
        tongueEndX = centerX; tongueEndY = cell.y - 4;
      } else { // Abajo
        eyeX1 = cell.x + 5; eyeY1 = cell.y + 13;
        eyeX2 = cell.x + 15; eyeY2 = cell.y + 13;
        tongueEndX = centerX; tongueEndY = cell.y + 24;
      }

      // Ojos
      ctx.beginPath();
      ctx.arc(eyeX1, eyeY1, 2.5, 0, Math.PI * 2);
      ctx.arc(eyeX2, eyeY2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupilas
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(eyeX1, eyeY1, 1, 0, Math.PI * 2);
      ctx.arc(eyeX2, eyeY2, 1, 0, Math.PI * 2);
      ctx.fill();

      // Lengua
      ctx.strokeStyle = "#e74c3c";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(tongueEndX, tongueEndY);
      ctx.stroke();

    } else if (isTail) {
      // Cola más afinada
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.arc(centerX, centerY, grid / 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Cuerpo
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.arc(centerX, centerY, (grid / 2) - 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Comer la manzana
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;
      scoreElement.innerText = score;

      // Subir a Nivel 2 al llegar a 50 puntos
      if (score >= 50 && level === 1) {
        level = 2;
        if (levelElement) levelElement.innerText = `Nivel: ${level}`;
        generateObstacles();
      }

      if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
        localStorage.setItem("snakeHighScore", highScore);
      }

      spawnApple();
    }

    // Colisión consigo misma
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
      }
    }

    // Colisión con Obstáculos en Nivel 2
    if (level === 2) {
      obstacles.forEach(obs => {
        if (snake.x === obs.x && snake.y === obs.y) {
          resetGame();
        }
      });
    }
  });
}

// Lógica de cambio de dirección
function moveUp() { if (snake.dy === 0) { snake.dy = -grid; snake.dx = 0; } }
function moveDown() { if (snake.dy === 0) { snake.dy = grid; snake.dx = 0; } }
function moveLeft() { if (snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } }
function moveRight() { if (snake.dx === 0) { snake.dx = grid; snake.dy = 0; } }

// 1. Controles por teclado (añadida tecla 'P' para Pausa)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  else if (e.key === "ArrowUp" || e.key === "w") moveUp();
  else if (e.key === "ArrowRight" || e.key === "d") moveRight();
  else if (e.key === "ArrowDown" || e.key === "s") moveDown();
  else if (e.key === "p" || e.key === "P") togglePause();
});

// Listener del botón de pausa
if (btnPause) {
  btnPause.addEventListener("click", togglePause);
}

// Controles en pantalla
document.getElementById("btn-up")?.addEventListener("click", moveUp);
document.getElementById("btn-down")?.addEventListener("click", moveDown);
document.getElementById("btn-left")?.addEventListener("click", moveLeft);
document.getElementById("btn-right")?.addEventListener("click", moveRight);

requestAnimationFrame(loop);