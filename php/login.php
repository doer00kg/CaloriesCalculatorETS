<?php
session_start();

include "dp.php";

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "caloriescalculatorets";

// Підключаємося до БД
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Отримуємо дані з форми
$email    = $_POST['email']    ?? '';
$passwd   = $_POST['password'] ?? '';

if (!$email) {
    die("Email is required.");
}
if (!$passwd) {
    die("Password is required.");
}

// Шукаємо користувача з таким email
$stmt = $conn->prepare("SELECT id, password FROM user WHERE login = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    // Користувача з таким email не знайдено
    echo "Error: Цей email не зареєстрований.";
} else {
    // Є запис — отримуємо храниме в БД значення пароля
    $stmt->bind_result($user_id, $db_password);
    $stmt->fetch();

    if ($passwd === $db_password) {
        // Успішний вхід
        $_SESSION['user_id']   = $user_id;
        $_SESSION['login']     = $email;
        $_SESSION['logged_in'] = true;

        // Перенаправлення на захищену сторінку
        header("Location: ../ets1.php");
        exit;
    } else {
        // Невірний пароль
        echo "Error: Невірний пароль.";
    }
}

$stmt->close();
$conn->close();
?>