const board = document.querySelector(".game-board");
const instruction = document.querySelector(".instruction");
const logo = document.querySelector(".logo");
const currentScore = document.querySelector(".current");
const highScoreElement = document.querySelector(".high");
const gridSize = 20;
const defaultGameSpeed = 350;
const gameSpeedIncrement = 1;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let gameInterval;
let gameSpeed = defaultGameSpeed;
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
  snake.forEach((segment, i) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    if (i === 0) {
      snakeElement.classList.add("head");
      snakeElement.classList.add(direction);
      snakeElement.appendChild(createGameElement("div", "eye"));
      snakeElement.appendChild(createGameElement("div", "eye"));
    }
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
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1,
    };
  } while (isOnSnake(newFood));
  return newFood;
}

function isOnSnake(position) {
  return snake.some((segment) => {
    return segment.x === position.x && segment.y === position.y;
  });
}

function moveSnake() {
  const newHead = generateNewHead();
  snake.unshift(newHead);
  if (ifSnakeAteFood(newHead)) {
    score++;
    currentScore.textContent = score.toString().padStart(3, "0");
    food = generateFood();
    clearInterval(gameInterval);
    if (gameSpeed > 200) gameSpeed -= gameSpeedIncrement;
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision() ? gameOver() : draw();
    }, gameSpeed);
  } else {
    snake.pop();
  }
}

function generateNewHead() {
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
  return newHead;
}

function ifSnakeAteFood(newHead) {
  if (newHead.x === food.x && newHead.y === food.y) {
    return true;
  } else {
    return false;
  }
}

function startGame() {
  instruction.style.display = "none";
  logo.style.display = "none";
  gameStarted = true;
  food = generateFood();
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision() ? gameOver() : draw();
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
      if (lastDirection !== "down") {
        direction = "up";
      }
    } else if (
      event.key === "ArrowDown" ||
      event.code === "ArrowDown" ||
      event.key === "s" ||
      event.code === "KeyS" ||
      event.key === "S"
    ) {
      if (lastDirection !== "up") {
        direction = "down";
      }
    } else if (
      event.key === "ArrowLeft" ||
      event.code === "ArrowLeft" ||
      event.key === "a" ||
      event.code === "KeyA" ||
      event.key === "A"
    ) {
      if (lastDirection !== "right") {
        direction = "left";
      }
    } else if (
      event.key === "ArrowRight" ||
      event.code === "ArrowRight" ||
      event.key === "d" ||
      event.code === "KeyD" ||
      event.key === "D"
    ) {
      if (lastDirection !== "left") {
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
