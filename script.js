const board = document.querySelector(".game-board");
const instruction = document.querySelector(".instruction");
const logo = document.querySelector(".logo");
const currentScore = document.querySelector(".current");
const highScoreElement = document.querySelector(".high");
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let gameInterval;
const defaultGameSpeed = 300;
let gameSpeed = defaultGameSpeed;
const gameSpeedIncrement = 10;
let gameStarted = false;
let score = 0;
let highScore = 0;
let direction = "down";
let lastDirection = "down";

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function createGameElement(tagName, className) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
}

function setPosition(element, position) {
  element.style.gridRow = position.y;
  element.style.gridColumn = position.x;
}

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function generateFood() {
  return {
    y: Math.floor(Math.random() * gridSize) + 1,
    x: Math.floor(Math.random() * gridSize) + 1,
  };
}

function moveSnake() {
  const head = snake[0];
  const newHead = { x: head.x, y: head.y };
  lastDirection = direction;
  switch (direction) {
    case "up":
      newHead.y--;
      break;
    case "down":
      newHead.y++;
      break;
    case "left":
      newHead.x--;
      break;
    case "right":
      newHead.x++;
      break;
  }
  snake.unshift(newHead);
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    currentScore.textContent = score.toString().padStart(3, "0");
    food = generateFood();
    clearInterval(gameInterval);
    if (gameSpeed > 150) gameSpeed -= gameSpeedIncrement;
    gameInterval = setInterval(() => {
      moveSnake();
      if (checkCollision()) {
        gameOver();
      } else {
        draw();
      }
    }, gameSpeed);
  } else {
    snake.pop();
  }
}

function startGame() {
  instruction.style.display = "none";
  logo.style.display = "none";
  gameStarted = true;
  food = generateFood();
  gameInterval = setInterval(() => {
    moveSnake();
    if (checkCollision()) {
      gameOver();
    } else {
      draw();
    }
  }, gameSpeed);
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    return true;
  }
  for (let i = 3; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function handleKeydown(event) {
  if (!gameStarted) {
    if (event.key === " " || event.code === "Space") {
      startGame();
    }
  } else {
    if (
      event.key === "ArrowUp" ||
      event.code === "ArrowUp" ||
      event.key === "w" ||
      event.code === "KeyW" ||
      event.key === "W"
    ) {
      if (direction !== "down" && lastDirection !== "down") {
        direction = "up";
      }
    } else if (
      event.key === "ArrowDown" ||
      event.code === "ArrowDown" ||
      event.key === "s" ||
      event.code === "KeyS" ||
      event.key === "S"
    ) {
      if (direction !== "up" && lastDirection !== "up") {
        direction = "down";
      }
    } else if (
      event.key === "ArrowLeft" ||
      event.code === "ArrowLeft" ||
      event.key === "a" ||
      event.code === "KeyA" ||
      event.key === "A"
    ) {
      if (direction !== "right" && lastDirection !== "right") {
        direction = "left";
      }
    } else if (
      event.key === "ArrowRight" ||
      event.code === "ArrowRight" ||
      event.key === "d" ||
      event.code === "KeyD" ||
      event.key === "D"
    ) {
      if (direction !== "left" && lastDirection !== "left") {
        direction = "right";
      }
    }
  }
}

function gameOver() {
  if (score > highScore) {
    highScore = score + 0;
    highScoreElement.textContent = highScore.toString().padStart(3, "0");
  }
  score = 0;
  currentScore.textContent = "000";
  board.innerHTML = "";
  clearInterval(gameInterval);
  instruction.style.display = "block";
  logo.style.display = "block";
  gameStarted = false;
  gameSpeed = defaultGameSpeed;

  snake = [{ x: 10, y: 10 }];
  direction = "down";
}

document.addEventListener("keydown", handleKeydown);
