<?php
session_start();
if (!empty($_SESSION['user_id'])) {
    header('Location: profile.php');
    exit;
}
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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>
<body>
        
  <header class="main-header">
    <div class="header-title">
      <h1 class="site-title">Eager to Sport</h1>
    </div>
  
    <nav class="navbar sticky-navbar">
      <div class="nav-links">
        <a href="ets1.html" class="nav-link">Profile</a>
        <a href="food.html"   class="nav-link">Food</a>
        <a href="stats.html"  class="nav-link">Stats</a>

        <div class="settings-icon">
          <a href="settings.php">
          <i class="fas fa-cog"></i>
        </a>
      </div>
    </div>
  </header>
  
  <div class="content-box">
<!-- 1) Вкладки режиму -->
    <div class="auth-tabs">
      <button type="button" id="registerTab" class="tab">Реєстрація</button>
      <button type="button" id="loginTab"    class="tab">Вхід</button>
    </div>

    <!-- 2) Форма авторизації/реєстрації -->
    <div class="auth-form">
      <form id="authForm" action="php/register.php" method="POST">
        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <!-- Пароль -->
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" required>
        </div>
        <!-- Кнопка, текст змінюється через JS -->
        <button type="submit" id="submitBtn">Зареєструватися</button>
      </form>
    </div>
  </div>


<script src="script.js"></script>


</body>
</html>