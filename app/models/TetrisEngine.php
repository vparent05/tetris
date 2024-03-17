<?php
require_once('../app/models/TetrisGame.php');
require_once('../app/models/Piece.php');

class TetrisEngine {
  public static function update($game)
  {
    if (!isset($game->piece)) {
      for ($i = 0; $i < count($game->board); $i++) {
        $isRowFull = true;
        for ($j = 0; $j < count($game->board[$i]); $j++) {
          if ($game->board[$i][$j] == null) {
            $isRowFull = false;
            break;
          }
        }
        if ($isRowFull) {
          for ($j = 0; $j <= $i; $j++) {
            foreach ($game->board[$j] as $cell) {
              $cell && $cell->y++;
            }
          }
          array_splice($game->board, $i, 1);
          array_unshift($game->board, array_fill(0, count($game->board[0]), null));
          $game->score += 10;
  
          return $game;
        }
      }
  
      if ($game->nextPiece) {
        $game->nextPiece->x = count($game->board[0]) / 2 - 2;
        $game->nextPiece->y = 0;
        $game->piece = $game->nextPiece;
      }
      $game->nextPiece = new Piece(1, 1, rand(0, count(Piece::$SHAPES) - 1));
      return $game;
    }
  
    if (!$game->piece->move($game->board, 'down')) {
      if ($game->piece->y <= 0) {
        $game->isGameOver = true;
        return $game;
      }
  
      $blocks = $game->piece->getBlocks();
      for ($i = 0; $i < count($blocks); $i++) {
        $block = $blocks[$i];
        if ($block) {
          $game->board[$block[1]][$block[0]] = Piece::$COLORS[$game->piece->shapeIndex];
        }
      }
      $game->piece = null;
    }
  
    return $game;
  }
  
  public static function move($direction, $game)
  {
    if ($direction == null) {
      return $game;
    }
    $game->piece->move($game->board, $direction);
    return $game;
  }
}

?>