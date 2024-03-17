<?php

$SHAPES = [
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

$COLORS = [
  'cyan',
  'yellow',
  'purple',
  'orange',
  'blue',
  'red',
  'green',
];

class Piece
{
  public $x = 0;
  public $y = 0;
  public $shapeIndex = 0;
  public $shape = [];

  public function __construct($x, $y, $shapeIndex)
  {
    $this->x = $x;
    $this->y = $y;
    $this->shape = $SHAPES[$shapeIndex];
    $this->shapeIndex = $shapeIndex;
  }

  public function move($board, $direction)
  {
    switch ($direction) {
      case 'left':
        if (!$this->isTouching($board, 'left')) {
          $this->x -= 1;
        }
        break;
      case 'right':
        if (!$this->isTouching($board, 'right')) {
          $this->x += 1;
        }
        break;
      case 'down':
        if (!$this->isTouching($board, 'down')) {
          $this->y += 1;
          break;
        } else {
          return false;
        }
      case 'rotate':
        rotate($board);
        break;
    }
    return true;
  }

  public function rotate($board)
  {
    $newShape = [];
    for ($i = 0; $i < count($this->shape); $i++) {
      for ($j = 0; $j < count($this->shape[$i]); $j++) {
        if (!isset($newShape[$j])) {
          $newShape[$j] = [];
        }
        $newShape[$j][count($this->shape) - $i - 1] = $this->shape[$i][$j];
      }
    }

    $rotationAllowed = true;
    for ($i = 0; $i < count($newShape); $i++) {
      for ($j = 0; $j < count($newShape[$i]); $j++) {
        $x = $this->x + (count($newShape) - $i);
        $y = $this->y + (count($newShape[$i]) - $j);
        if ($newShape[$i][$j] && ($x < 0 || $x > count($board) || $y >= count($board[0]) || $board[$x][$y])) {
          $rotationAllowed = false;
        }
      }
    }

    if ($rotationAllowed) {
      $this->shape = $newShape;
    }
  }

  public function getBlocks()
  {
    $blocks = [];
    for ($i = 0; $i < count($this->shape); $i++) {
      for ($j = 0; $j < count($this->shape[$i]); $j++) {
        if ($this->shape[$i][$j]) {
          $blocks[] = [$this->x + $i, $this->y + $j];
        }
      }
    }
    return $blocks;
  }

  public function isTouching($board, $direction) {
    $blocks = $this->getBlocks();
    for ($i = 0; $i < count($blocks); $i++) {
      if (!isset($blocks[$i])) {
        continue;
      }
      switch ($direction) {
        case 'left':
          if ($piece[$i][0] === 0) {
            return true;
          }
          if ($board[$piece[$i][1]][$piece[$i][0] - 1]) {
            return true;
          }
          break;
        case 'right':
          if ($piece[$i][0] === count($board[0]) - 1) {
            return true;
          }
          if ($board[$piece[$i][1]][piece[$i][0] + 1]) {
            return true;
          }
          break;
        case 'down':
          if ($piece[$i][1] === count($board) - 1) {
            return true;
          }
          if ($board[$piece[$i][1] + 1][piece[$i][0]]) {
            return true;
          }
          break;
      }
    }
    return false;
  }
}
?>