<?php
session_start();

// Параметри для підключення до MySQL
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "caloriescalculatorets";

// Перевіряємо, чи користувач залогінений
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    die("You are not logged in.");
}

// Перевіряємо, чи прийшли всі потрібні поля через POST
if (!isset($_POST['inputProtein'], $_POST['inputFat'], $_POST['inputCarb'])) {
    die("Missing data.");
}

// Отримуємо значення з форми
$user_id = $_SESSION['user_id'];
$date    = date('Y-m-d');
$protein = (int) $_POST['inputProtein'];
$fat     = (int) $_POST['inputFat'];
$carbs   = (int) $_POST['inputCarb'];

// Підключаємося до БД
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 1) Спочатку перевіряємо, чи є вже запис з цією парою (id_user, date)
$sqlCheck = "SELECT 1 
             FROM user_data_diagram 
             WHERE id_user = ? 
               AND date = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("is", $user_id, $date);
$stmtCheck->execute();
$stmtCheck->store_result();

// 2) Якщо запис знайдено → виконуємо UPDATE, інакше → робимо INSERT
if ($stmtCheck->num_rows > 0) {
    // 2a) Оновлюємо існуючий рядок
    $sqlUpdate = "
        UPDATE user_data_diagram
        SET protein = ?, fat = ?, carbs = ?
        WHERE id_user = ? 
          AND date = ?
    ";
    $stmtUpd = $conn->prepare($sqlUpdate);
    $stmtUpd->bind_param("iiiis", $protein, $fat, $carbs, $user_id, $date);
    if (! $stmtUpd->execute()) {
        echo "Error on UPDATE: " . $stmtUpd->error;
        $stmtUpd->close();
        $stmtCheck->close();
        $conn->close();
        exit;
    }
    $stmtUpd->close();
} else {
    // 2b) Вставляємо новий рядок
    $sqlInsert = "
        INSERT INTO user_data_diagram (id_user, date, protein, fat, carbs)
        VALUES (?, ?, ?, ?, ?)
    ";
    $stmtIns = $conn->prepare($sqlInsert);
    $stmtIns->bind_param("isiii", $user_id, $date, $protein, $fat, $carbs);
    if (! $stmtIns->execute()) {
        echo "Error on INSERT: " . $stmtIns->error;
        $stmtIns->close();
        $stmtCheck->close();
        $conn->close();
        exit;
    }
    $stmtIns->close();
}

$stmtCheck->close();
$conn->close();

// Після успішного INSERT або UPDATE повертаємо користувача назад на ets1.php
header("Location: ets1.php");
exit;
?>
