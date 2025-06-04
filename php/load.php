<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "caloriescalculatorets";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    die("Not logged in.");
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT sex, age, height, weight, activity_level, fats, goal, goal_weight FROM information_user WHERE id_user = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode($data);
?>
