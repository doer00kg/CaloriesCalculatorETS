

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


const ctx = document.getElementById('myPieChart').getContext('2d');

let myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Proteins', 'Fats', 'Carbohydrates'],
    datasets: [{
      data: [30, 20, 50],
      backgroundColor: ['#ff4800', '#0073ff', '#ffee00'],
      hoverOffset: 20
    }]
  },
  options: {
    responsive: false
  }
});

document.getElementById('updateChartBtn').addEventListener('click', () => {
  const protein = parseFloat(document.getElementById('inputProtein').value) || 0;
  const fat = parseFloat(document.getElementById('inputFat').value) || 0;
  const carb = parseFloat(document.getElementById('inputCarb').value) || 0;

  myPieChart.data.datasets[0].data = [protein, fat, carb];
  myPieChart.update();
});
