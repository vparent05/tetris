<?php
require_once('_config.php');

$newGame = move($_POST["direction"], $_SESSION["game"]);

header("Content-Type: application/json");
echo json_encode($newGame);
?>