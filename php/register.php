<?php

include "dp.php";

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "caloriescalculatorets";

// Connect to database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get email from POST (or GET, depending on your form)
$email = $_POST['email'] ?? '';

if (!$email) {
    die("Email is required.");
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM user WHERE login = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Email exists — reject
    echo "Error: This email is already registered.";
} else {
    // Email does not exist — proceed with insert
    $password = $_POST['password'] ?? '';

    if (!$password) {
        echo "Password is required.";
    } else {
        $insert = $conn->prepare("INSERT INTO user (password, login) VALUES (?, ?)");
        $insert->bind_param("ss", $password, $email);

        if ($insert->execute()) {
            echo "User registered successfully!";
        } else {
            echo "Insert error: " . $insert->error;
        }
        $insert->close();
    }
}

$stmt->close();
$conn->close();





?>