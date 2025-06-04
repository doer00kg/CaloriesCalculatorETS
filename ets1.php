<?php

session_start();

// Зразу визначаємо $logged_in, щоб не отримувати “undefined variable”
$logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'];

// Далі — ваш код підключення до БД і вибірка значень…
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "caloriescalculatorets";

// Переконаємося, що користувач залогінений:
if (!$logged_in) {
    die("You are not logged in.");
}

// Підключаємося до БД, щоб підвантажити значення на сьогодні:
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];
$date    = date('Y-m-d');
$sql     = "SELECT protein, fat, carbs FROM user_data_diagram WHERE id_user = ? AND date = ?";
$stmt    = $conn->prepare($sql);
$stmt->bind_param("is", $user_id, $date);
$stmt->execute();
$stmt->bind_result($proteinSaved, $fatSaved, $carbSaved);

if (!$stmt->fetch()) {
    // Якщо запису немає — ставимо дефолт
    $proteinSaved = 30;
    $fatSaved     = 20;
    $carbSaved    = 50;
}
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eager to Sport</title>
    <link rel="stylesheet" href="style.css">
    <!-- fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
        
  <header class="main-header">
    <div class="header-title">
      <h1 class="site-title">Eager to Sport</h1>
    </div>
    
    <nav class="navbar sticky-navbar">
      <div class="nav-links">
        <a href="ets1.php" class="nav-link">Profile</a>
        <a href="food.html"   class="nav-link">Food</a>
        <a href="stats.html"  class="nav-link">Stats</a>

        <div class="settings-icon">
          <a href="settings.php">
          <i class="fas fa-cog"></i>
        </a>
      </div>
    </div>
  </header>
  
<?php if ($logged_in): ?>
  <div class="content-box">
    <div class="chart-container">
      <canvas id="pieChart"></canvas>
    </div>
    <div class="input-section">
      <form id="ets1Form" action="data.php" method="POST">
        <!-- Ось тут обгортаємо всі label+input в єдиний блок .inputs-row -->
        <div class="inputs-row">
          <label>
            Proteins:
            <input type="number" id="inputProtein" name="inputProtein" value="<?php echo $proteinSaved ?: 30; ?>">
          </label>
          <label>
            Fats:
            <input type="number" id="inputFat" name="inputFat" value="<?php echo $fatSaved ?: 20; ?>">
          </label>
          <label>
            Carbs:
            <input type="number" id="inputCarb" name="inputCarb" value="<?php echo $carbSaved ?: 50; ?>">
          </label>
        </div>
        <!-- Тепер кнопка у власному контейнері .button-row, щоб її вирівняти по центру -->
        <div class="button-row">
          <button type="submit" id="updateChartBtn">Записати дані в діаграму</button>
        </div>
      </form>
    </div>
  </div>
<?php endif; ?>



  



<script src="script.js"></script>

</body>
</html>