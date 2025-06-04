<?php
session_start();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// Обробка виходу з акаунту
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header('Location: ets1.php');
    exit();
}

$logged_in = !empty($_SESSION['user_id']);

if ($logged_in) {

    $servername = "localhost";
    $username   = "root";
    $password   = "";
    $dbname     = "caloriescalculatorets";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT password FROM user WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $stmt->bind_result($db_password);
    $stmt->fetch();
    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Eager to Sport</title>
    <link rel="stylesheet" href="style.css" />
    <!-- fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet"/>
</head>
<body>
  <header class="main-header">
    <div class="header-title">
      <h1 class="site-title">Eager to Sport</h1>
    </div>

    <nav class="navbar sticky-navbar">
      <div class="nav-links">
        <a href="ets1.php" class="nav-link">Profile</a>
        <a href="food.html" class="nav-link">Food</a>
        <a href="stats.html" class="nav-link">Stats</a>

        <div class="settings-icon">
          <a href="settings.php">
            <i class="fas fa-cog"></i>
          </a>
        </div>
      </div>
    </nav>
  </header>

  <div class="content-box">

    <?php if ($logged_in): ?>
      <div class="account-info" style="margin-bottom: 1.5rem; text-align: left;">
        <p><strong>Пошта:</strong> <?php echo htmlspecialchars($_SESSION['login']); ?></p>
        <p>
          <strong>Пароль:</strong>
          <span id="passwordField">
            <?php echo str_repeat('*', mb_strlen($db_password)); ?>
          </span>
          <button type="button" id="togglePassword" style="margin-left:0.5rem; cursor:pointer; background:none; border:none; color:#157c32;">Показати</button>
        </p>
      </div>
    <?php endif; ?>
    <div class="auth-tabs">
      <?php if (!$logged_in): ?>
        <button type="button" id="registerTab" class="tab">Реєстрація</button>
        <button type="button" id="loginTab" class="tab">Вхід</button>
      <?php else: ?>
        <form method="POST" action="settings.php" style="display:inline;">
          <button type="submit" name="logout" class="logout-btn">
            <i class="fas fa-sign-out-alt"></i> Вийти з акаунту</button>
        </form>
      <?php endif; ?>
    </div>

    <?php if (!$logged_in): ?>
    <div class="auth-form">
      <form id="authForm" action="php/register.php" method="POST">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" id="submitBtn">Зареєструватися</button>
      </form>
    </div>
    <?php endif; ?>
  
  
  </div>


  <script>
  document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('togglePassword');
  const pwdField  = document.getElementById('passwordField');
  if (!toggleBtn || !pwdField) return;

  const realPass = "<?php echo addslashes($db_password); ?>";

  toggleBtn.addEventListener('click', () => {
    if (pwdField.textContent.includes('*')) {
      pwdField.textContent = realPass;
      toggleBtn.textContent = 'Сховати';
    } else {
      pwdField.textContent = '*'.repeat(realPass.length);
      toggleBtn.textContent = 'Показати';
    }
  });
});
</script>
  <script src="script.js"></script>
</body>
</html>
