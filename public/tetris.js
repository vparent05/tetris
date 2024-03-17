const boardElement = document.getElementById('board');
const scoreElement = document.querySelectorAll('.score');
const gameOverElement = document.querySelector('.game-over');

const COLORS = [
  'cyan',
  'yellow',
  'purple',
  'orange',
  'blue',
  'red',
  'green',
];

function getPieceHTML(piece) {
  const pieceDiv = document.createElement('div');
  pieceDiv.className = 'piece';

  piece.shape.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (!cell) return;
      const x = piece.x + i;
      const y = piece.y + j;
      pieceDiv.appendChild(getBlockHTML(COLORS[piece.shapeIndex], x, y));
    });
  });
  return piece;
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
  const game = await update();
  if (game.isGameOver) {
    return;
  }
  await new Promise(resolve => setTimeout(resolve, 1000 / (1 + game.score / 100)));
  loop();
}

function draw(game) {
  boardElement.innerHTML = '';
  game.board.forEach((row, i) => row.forEach((block, j) => block && boardElement.appendChild(getBlockHTML(block, j, i))));
  if (game.piece) boardElement.appendChild(getPieceHTML(game.piece));

  const nextPieceContainer = document.querySelector('.next-piece');
  nextPieceContainer.innerHTML = '';
  if (game.nextPiece) nextPieceContainer.appendChild(getPieceHTML(game.nextPiece));

  scoreElement.forEach(e => (e.innerHTML = `Score: ${game.score}`));
}

async function update() {
  const game = await fetch('http://localhost:80/api.php?action=update').then(res => res.json());
  draw(game);
  return game;
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'a' || 'A':
      fetch('http://localhost:80/api.php?action=move&direction=left')
        .then(res => res.json())
        .then(draw);
      break;
    case 'd' || 'D':
      fetch('http://localhost:80/api.php?action=move&direction=right')
        .then(res => res.json())
        .then(draw);
      break;
    case 's' || 'S':
      fetch('http://localhost:80/api.php?action=move&direction=down')
        .then(res => res.json())
        .then(draw);
      break;
    case ' ':
      fetch('http://localhost:80/api.php?action=move&direction=drop')
        .then(res => res.json())
        .then(draw);
      break;
  }
});

async function play() {
  gameOverElement.setAttribute('style', 'display: none;');
  const game = await fetch('http://localhost:80/api.php?action=new').then(res => res.json());
  boardElement.style.width = `${game.board[0].length * 30}px`;
  boardElement.style.height = `${game.board.length * 30}px`;
  draw(game);
  loop();
}

play();