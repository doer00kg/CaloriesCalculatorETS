<?php
$servername = "localhost";
$username = "root";
$password = ""; 
$dbname = "caloriescalculatorets";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if database exists
$db_check = $conn->query("SHOW DATABASES LIKE '$dbname'");
if ($db_check->num_rows == 0) {
    // Database does not exist, create it
    $sql = "CREATE DATABASE $dbname";
    $conn->query($sql);
}

$conn = new mysqli($servername, $username, $password, $dbname);

$result = $conn->query("SHOW TABLES LIKE 'user'");

if ($result && $result->num_rows == 0) {
    // Table doesn't exist, create it
    $createTableSQL = "
        CREATE TABLE user (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->query($createTableSQL);
}

$conn->close();
?>

