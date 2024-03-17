<?php
require_once('_config.php');

session_start();

$_SESSION["game"] = TetrisEngine::move($_POST["direction"], $_SESSION["game"]);

header("Content-Type: application/json");
echo json_encode($_SESSION["game"]);
?>