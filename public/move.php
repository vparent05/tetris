<?php
require_once('../app/models/TetrisEngine.php');

session_start();

$_SESSION["game"] = TetrisEngine::move($_GET["direction"], $_SESSION["game"]);

header("Content-Type: application/json");
echo json_encode($_SESSION["game"]);
?>