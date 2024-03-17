<?php
class TetrisGame
{
  public $board;
  public $piece;
  public $nextPiece;
  public $score;
  public $isGameOver;

  public function __construct($rows, $cols)
  {
    $this->board = [];
    $this->piece = null;
    $this->nextPiece = null;
    $this->score = 0;
    $this->isGameOver = false;

    if ($rows < 10 || $cols < 5) {
      throw new Exception('Board must be at least 10x10');
    }

    for ($i = 0; $i < $rows; $i++) {
      $this->board[$i] = [];
      for ($j = 0; $j < $cols; $j++) {
        $this->board[$i][$j] = null;
      }
    }
  }
}
?>