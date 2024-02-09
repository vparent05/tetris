const boardElement = document.getElementById('board');
const scoreElement = document.querySelectorAll('.score');
const gameOverElement = document.querySelector('.game-over');


const ROWS = 20;
const COLS = 10;
const SHAPES = [
  [
    [1, 1, 1, 1]
  ],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 1, 1],
    [0, 0, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ]
];
const COLORS = [
  'cyan',
  'yellow',
  'purple',
  'orange',
  'blue',
  'red',
  'green',
];

// blocks: [[x, y], [x, y], ...]
function isTouching(blocks, direction) {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] === null) {
      continue;
    }
    switch (direction) {
      case 'left':
        if (blocks[i][0] === 0) {
          return true;
        }
        if (board[blocks[i][1]][blocks[i][0] - 1]) {
          return true;
        }
        break;
      case 'right':
        if (blocks[i][0] === COLS - 1) {
          return true;
        }
        if (board[blocks[i][1]][blocks[i][0] + 1]) {
          return true;
        }
        break;
      case 'down':
        if (blocks[i][1] === ROWS - 1) {
          return true;
        }
        if (board[blocks[i][1] + 1][blocks[i][0]]) {
          return true;
        }
        break;
    }
  }
  return false;
}

class Piece {
  x = 0;
  y = 0;
  shapeIndex = 0;
  shape = [];
  constructor(x, y, shapeIndex) {
    this.x = x;
    this.y = y;
    this.shape = SHAPES[shapeIndex];
    this.shapeIndex = shapeIndex;
  }

  /* Returns false if the piece has done falling (should not move anymore) */
  move(direction) {
    const blocks = this.getBlocks();
    switch (direction) {
      case 'left':
        if (!isTouching(blocks, 'left')) {
          this.x -= 1;
        }
        break;
      case 'right':
        if (!isTouching(blocks, 'right')) {
          this.x += 1;
        }
        break;
      case 'down':
        if (!isTouching(blocks, 'down')) {
          this.y += 1;
          break;
        } else {
          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (block) {
              board[block[1]][block[0]] = new Block(COLORS[this.shapeIndex]);
            }
          }
          return false;
        }
    }
    return true;
  }

  rotate() {
    const newShape = [];
    for (let i = 0; i < this.shape[0].length; i++) {
      newShape.push(this.shape.map(row => row[i]).reverse());
    }
    if (newShape.every((row, i) => row.every((cell, j) => {
      if (cell) {
        if (this.x + j < 0 || this.x + j >= COLS || this.y + i >= ROWS) {
          return false;
        }
        if (board[this.y + i][this.x + j]) {
          return false;
        }
      }
      return true;
    }))) {
      this.shape = newShape;
    }
  }

  getHTML() {
    const piece = document.createElement('div');
    piece.className = 'piece';
    this.getBlocks().forEach(block =>
      block &&
      piece.appendChild(
        (new Block(COLORS[this.shapeIndex])).getHTML(block[0], block[1])
      )
    );
    return piece;
  }

  getBlocks() {
    return this.shape.reduce((blocks, row, i) =>
      blocks.concat(
        row.map((cell, j) => cell ? [this.x + i, this.y + j] : null)
      ), []
    ).filter(block => block !== null);
  }
}

class Block {
  color = '';
  constructor(color) {
    this.color = color;
  }

  getHTML(x, y) {
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = this.color;
    block.style.border = `1px solid black`;
    block.style.left = `${x * 30}px`;
    block.style.top = `${y * 30}px`;
    return block;
  }
}

function loop() {
  draw();
  update();
}

function draw() {
  boardElement.innerHTML = '';
  board.forEach((row, i) => row.forEach((block, j) => block && boardElement.appendChild(block.getHTML(j, i))));
  if (piece) boardElement.appendChild(piece.getHTML());

  const nextPieceContainer = document.querySelector('.next-piece');
  nextPieceContainer.innerHTML = '';
  if (nextPiece) nextPieceContainer.appendChild(nextPiece.getHTML());
}

async function update() {
  if (!piece || !piece.move('down')) {
    if (piece && piece.y <= 0) {
      gameOverElement.setAttribute('style', 'display: block;');
      return;
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i].every(cell => cell !== null)) {
        for (let j = 0; j <= i; j++) {
          board[j].forEach(cell => cell && cell.y++);
        }
        board.splice(i, 1);
        board.unshift(new Array(COLS).fill(null));
        await new Promise(r => setTimeout(r, 1000 / falling_speed));
        draw();
        score += 10;
        scoreElement.forEach(e => (e.innerHTML = `Score: ${score}`));
        falling_speed += 0.1;
      }
    }
    if (nextPiece) {
      nextPiece.x = COLS / 2 - 2;
      nextPiece.y = 0;
      piece = nextPiece;
    }
    nextPiece = new Piece(1, 1, Math.floor(Math.random() * SHAPES.length));
  }
  await new Promise(r => setTimeout(r, 1000 / falling_speed));
  loop();
}

boardElement.style.width = `${COLS * 30}px`;
boardElement.style.height = `${ROWS * 30}px`;
document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'a' || 'A':
      piece.move('left');
      draw();
      break;
    case 'd' || 'D':
      piece.move('right');
      draw();
      break;
    case 's' || 'S':
      piece.move('down');
      draw();
      break;
    case ' ':
      piece.rotate();
      draw();
      break;
  }
});

let piece;
let nextPiece;
let score;
let falling_speed;
let board;
function play() {
  gameOverElement.setAttribute('style', 'display: none;');
  piece = null;
  score = 0;
  falling_speed = 1;
  board = [];
  for (let i = 0; i < ROWS; i++) {
    board.push([]);
    for (let j = 0; j < COLS; j++) {
      board[i][j] = null;
    }
  }

  scoreElement.forEach(e => (e.innerHTML = `Score: ${score}`));
  update();
}

play();