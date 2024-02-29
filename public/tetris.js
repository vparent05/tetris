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

// piece: [[x, y], [x, y], ...]
// board: [[0, 0, 1, 0, ...], ...]
function isTouching(board, piece, direction) {
  for (let i = 0; i < piece.length; i++) {
    if (piece[i] === null) {
      continue;
    }
    switch (direction) {
      case 'left':
        if (piece[i][0] === 0) {
          return true;
        }
        if (board[piece[i][1]][piece[i][0] - 1]) {
          return true;
        }
        break;
      case 'right':
        if (piece[i][0] === COLS - 1) {
          return true;
        }
        if (board[piece[i][1]][piece[i][0] + 1]) {
          return true;
        }
        break;
      case 'down':
        if (piece[i][1] === ROWS - 1) {
          return true;
        }
        if (board[piece[i][1] + 1][piece[i][0]]) {
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
  move(board, direction) {
    const blocks = this.getBlocks();
    switch (direction) {
      case 'left':
        if (!isTouching(board, blocks, 'left')) {
          this.x -= 1;
        }
        break;
      case 'right':
        if (!isTouching(board, blocks, 'right')) {
          this.x += 1;
        }
        break;
      case 'down':
        if (!isTouching(board, blocks, 'down')) {
          this.y += 1;
          break;
        } else {
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
    console.log(this.shape);
    console.log(newShape);
    console.log(this.x, this.y);
    if (newShape.every((row, i) => row.every((cell, j) => {
      const x = this.x + (newShape.length - i);
      const y = this.y + (row.length - j);
      return !cell || x >= 0 && x < COLS && y < ROWS && !board[y][x];
    }
    ))) {
      this.shape = newShape;
    }
  }

  getHTML() {
    const piece = document.createElement('div');
    piece.className = 'piece';
    this.getBlocks().forEach(block =>
      block &&
      piece.appendChild(
        getBlockHTML(COLORS[this.shapeIndex], block[0], block[1])
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

function getBlockHTML(color, x, y) {
  const block = document.createElement('div');
  block.className = 'block';
  block.style.backgroundColor = color;
  block.style.border = `1px solid black`;
  block.style.left = `${x * 30}px`;
  block.style.top = `${y * 30}px`;
  return block;
}

async function loop() {
  update();
  await new Promise(resolve => setTimeout(resolve, 1000 / falling_speed));
  loop();
}

function draw() {
  boardElement.innerHTML = '';
  board.forEach((row, i) => row.forEach((block, j) => block && boardElement.appendChild(getBlockHTML(block, j, i))));
  if (piece) boardElement.appendChild(piece.getHTML());

  const nextPieceContainer = document.querySelector('.next-piece');
  nextPieceContainer.innerHTML = '';
  if (nextPiece) nextPieceContainer.appendChild(nextPiece.getHTML());

  scoreElement.forEach(e => (e.innerHTML = `Score: ${score}`));
}

async function update() {
  if (!piece) {

    // check for full rows
    for (let i = 0; i < board.length; i++) {
      if (board[i].every(cell => cell !== null)) {
        for (let j = 0; j <= i; j++) {
          board[j].forEach(cell => cell && cell.y++);
        }
        board.splice(i, 1);
        board.unshift(new Array(COLS).fill(null));
        score += 10;
        falling_speed += 0.1;

        draw();
        return;
      }
    }

    // switch to next piece
    if (nextPiece) {
      nextPiece.x = COLS / 2 - 2;
      nextPiece.y = 0;
      piece = nextPiece;
    }
    nextPiece = new Piece(1, 1, Math.floor(Math.random() * SHAPES.length));

    draw();
    return;
  }

  if (!piece.move(board, 'down')) {
    if (piece.y <= 0) {
      gameOverElement.setAttribute('style', 'display: block;');

      draw();
      return;
    }

    const blocks = piece.getBlocks();
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block) {
        board[block[1]][block[0]] = COLORS[piece.shapeIndex];
      }
    }
    piece = null;
  }

  draw();
}

boardElement.style.width = `${COLS * 30}px`;
boardElement.style.height = `${ROWS * 30}px`;
document.addEventListener('keydown', event => {
  if (!piece) return;
  switch (event.key) {
    case 'a' || 'A':
      piece.move(board, 'left');
      draw();
      break;
    case 'd' || 'D':
      piece.move(board, 'right');
      draw();
      break;
    case 's' || 'S':
      piece.move(board, 'down');
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

  loop();
}

play();