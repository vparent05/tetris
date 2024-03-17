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
  }
}

header('Content-Type: application/json');
echo json_encode($_SESSION['game'] ?? ['version' => '0.2']);
?>