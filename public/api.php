<?php
require_once('../app/models/TetrisEngine.php');
require_once('../app/models/TetrisGame.php');

session_start();

if (isset($_GET['action'])) {
  switch ($_GET['action']) {
    case 'new':
      $_SESSION['game'] = new TetrisGame(20, 10);
      break;
    case 'update':
      $_SESSION['game'] = TetrisEngine::update($_SESSION['game']);
      break;
    case 'move':
      $_SESSION['game'] = TetrisEngine::move($_GET['direction'], $_SESSION['game']);
      break;
    case 'reset-leaderboard':
      $_SESSION['leaderboard'] = [];
      break;
  }
}

if (!isset($_SESSION['leaderboard'])) {
  $_SESSION['leaderboard'] = [];
}
if (isset($_SESSION['game'])) {
  for ($i = 0; $i < 10; $i++) {
    if (!isset($_SESSION['leaderboard'][$i])) {
      array_push($_SESSION['leaderboard'], ['score' => $_SESSION['game']->score, 'gameId' => $_SESSION['game']->id]);
      break;
    }
    if ($_SESSION['leaderboard'][$i]['gameId'] == $_SESSION['game']->id) {
      $_SESSION['leaderboard'][$i]['score'] = $_SESSION['game']->score;
      break;
    }
    if ($_SESSION['leaderboard'][$i]['score'] < $_SESSION['game']->score) {
      for ($j = $i; $j < count($_SESSION['leaderboard']); $j++) {
        if ($_SESSION['leaderboard'][$j]['gameId'] == $_SESSION['game']->id) {
          array_splice($_SESSION['leaderboard'], $j, 1);
          break;
        }
      }
      array_splice($_SESSION['leaderboard'], $i, 0, [['score' => $_SESSION['game']->score, 'gameId' => $_SESSION['game']->id]]);

      array_splice($_SESSION['leaderboard'], 10, 1);
      break;
    }
  }
}

header('Content-Type: application/json');
echo json_encode(['game' => $_SESSION['game'] ?? null, 'leaderboard' => $_SESSION['leaderboard']]);
?>