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

$result = $conn->query("SHOW TABLES LIKE 'user_data_diagram'");
if ($result && $result->num_rows == 0) {
    $createTableSQL = "
        CREATE TABLE user_data_diagram (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_user INT NOT NULL,
            date DATE NOT NULL,
            protein INT DEFAULT 0,
            fat INT DEFAULT 0,
            carbs INT DEFAULT 0,
            FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->query($createTableSQL);
}

$result = $conn->query("SHOW TABLES LIKE 'information_user'");
if ($result && $result->num_rows == 0) {
    $createTableSQL = "
        CREATE TABLE information_user (
            id_user INT NOT NULL,
            sex VARCHAR(1),
            age INT,
            height INT,
            weight INT,
            activity_level VARCHAR(20),
            fats INT,
            goal INT,
            goal_weight INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id_user),
            FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $conn->query($createTableSQL);
}



$conn->close();
?>



