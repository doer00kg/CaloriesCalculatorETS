
//верхній header nav
document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');

  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('hidden');
  });

  // Закривати при кліку поза меню
  document.addEventListener('click', (e) => {
    if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
      settingsMenu.classList.add('hidden');
    }
  });
});

// скрипт на активну вкладку
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop();

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active-link');
    }
  });
});





// Settings

document.addEventListener('DOMContentLoaded', () => {
  // елементи вкладок та форми
  const registerTab = document.getElementById('registerTab');
  const loginTab    = document.getElementById('loginTab');
  const submitBtn   = document.getElementById('submitBtn');
  const authForm    = document.getElementById('authForm');

  let mode = 'register';  // поточний режим

  // Перемикання на «Реєстрація»
  registerTab.addEventListener('click', () => {
    submitBtn.textContent = 'Зареєструватися';
  });

  // Перемикання на «Вхід»
  loginTab.addEventListener('click', () => {
    submitBtn.textContent = 'Ввійти';
  });

  

  // Функція відображення помилки
  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    input.parentNode.appendChild(error);
  }

  // Видалити всі попередні повідомлення про помилки
  function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.remove());
  }
});


// Settings КІНЕЦЬ

document.getElementById("loginTab").addEventListener("click", function() {
  document.getElementById("submitBtn").textContent = "Enter";
});

// Перемикання вкладок Рецепти / Продукти
function showMainTab(tabName) {
  document.getElementById('recipes').style.display = (tabName === 'recipes') ? 'block' : 'none';
  document.getElementById('products').style.display = (tabName === 'products') ? 'block' : 'none';
  
  document.getElementById('tab-recipes').classList.toggle('active-tab', tabName === 'recipes');
  document.getElementById('tab-products').classList.toggle('active-tab', tabName === 'products');
}

// Фільтрація категорій
function filterCategory(category) {
  const cards = document.querySelectorAll('#recipes .recipe-card');
  cards.forEach(card => {
    const match = card.dataset.category === category;
    card.style.display = match ? 'block' : 'none';
  });
}

function filterProduct(category) {
  const cards = document.querySelectorAll('#products .recipe-card');
  cards.forEach(card => {
    const match = card.dataset.category === category;
    card.style.display = match ? 'block' : 'none';
  });
}
function toggleDetails(button) {
  const card = button.closest('.recipe-card');
  const details = card.querySelector('.card-details');

  if (details.style.display === "none" || details.style.display === "") {
    details.style.display = "block";
    button.textContent = "Згорнути";
  } else {
    details.style.display = "none";
    button.textContent = "Детальніше";
  }
}


document.getElementById("registerTab").addEventListener("click", function() {
  document.getElementById("submitBtn").textContent = "Registration";
});

