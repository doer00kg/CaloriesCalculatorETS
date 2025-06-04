<?php
session_start();

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "caloriescalculatorets";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check login
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    die("You are not logged in.");
}

// List of required fields (excluding sex and goal since we'll default them)
$required_fields = [
    'year-slider',        // age
    'height-slider',
    'weight-slider',
    'activity-select',
    'fat-slider',
    'goal-slider'         // goal weight
];

// Validate required fields
foreach ($required_fields as $field) {
    if (!isset($_POST[$field])) {
        die("Missing field: $field");
    }
}

$user_id = $_SESSION['user_id'];

// Map and convert inputs
$sex_map  = ['male' => 'M', 'female' => 'W'];
$goal_map = ['lose' => 1, 'gain' => 2, 'maintain' => 3];

// Use defaults if missing or invalid
$sex_raw  = $_POST['sex'] ?? 'female'; // default: 'female'
$goal_raw = $_POST['goal'] ?? 'maintain';  // default: 'none'

$sex        = $sex_map[$sex_raw] ?? 'W'; // fallback to 'W' (female)
$goal       = $goal_map[$goal_raw] ?? 1; // fallback to 0 if not recognized
$age        = (int) $_POST['year-slider'];
$height     = (int) $_POST['height-slider'];
$weight     = (int) $_POST['weight-slider'];
$activity_level   = $_POST['activity-select'] ?? 'light';
$fats       = (int) $_POST['fat-slider'];
$goal_weight = (int) $_POST['goal-slider'];

// Insert or update row
$sql = "
    INSERT INTO information_user (id_user, sex, age, height, weight, activity_level, fats, goal, goal_weight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        sex = VALUES(sex),
        age = VALUES(age),
        height = VALUES(height),
        weight = VALUES(weight),
        activity_level = VALUES(activity_level),
        fats = VALUES(fats),
        goal = VALUES(goal),
        goal_weight = VALUES(goal_weight)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isiiisiii", $user_id, $sex, $age, $height, $weight, $activity_level, $fats, $goal, $goal_weight);

if ($stmt->execute()) {
    echo "Information saved successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
