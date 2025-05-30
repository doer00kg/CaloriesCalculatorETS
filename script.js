
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

document.getElementById("registerTab").addEventListener("click", function() {
  document.getElementById("submitBtn").textContent = "Registration";
});

// Artem Havryliuk "Stats"

// script.js

// ===== Model: всі розрахунки =====
class StatsModel {
  constructor({ weight, height, age, gender, activity, goal }) {
    this.weight   = weight;
    this.height   = height;
    this.age      = age;
    this.gender   = gender;
    this.activity = activity;
    this.goal     = goal;
  }

  // Індекс маси тіла
  calcBMI() {
    const m = this.height / 100;
    return this.weight / (m * m);
  }

  // Статус BMI для шкали
  getBmiStatus() {
    const bmi = this.calcBMI();
    if (bmi < 18.5)  return { idx: 0, label: 'Недостатня вага' };
    if (bmi < 25)    return { idx: 1, label: 'Норма' };
    if (bmi < 30)    return { idx: 2, label: 'Зайва вага' };
    if (bmi < 35)    return { idx: 3, label: 'Ожиріння I' };
    if (bmi < 40)    return { idx: 4, label: 'Ожиріння II' };
                     return { idx: 5, label: 'Ожиріння III' };
  }

  // Базальний обмін (Mifflin–St Jeor), потрібне для макросів
  calcBMR() {
    const base = 10 * this.weight + 6.25 * this.height - 5 * this.age;
    return this.gender === 'female' ? base - 161 : base + 5;
  }

  // Коефіцієнти активності
  _activityFactors() {
    return {
      sedentary: 1.2,
      light:     1.375,
      moderate:  1.55,
      heavy:     1.725,
      extreme:   1.9
    }[this.activity];
  }

  // TDEE
  calcTDEE() {
    return this.calcBMR() * this._activityFactors();
  }

  // Цільова калорійність
  calcTargetCalories() {
    const tdee = this.calcTDEE();
    if (this.goal === 'lose') return tdee - 500;
    if (this.goal === 'gain') return tdee + 500;
    return tdee; // maintain
  }

  // Макронутрієнти
  calcMacros() {
    const cal = this.calcTargetCalories();
    return {
      prots:  Math.round((0.30 * cal) / 4),
      carbs:  Math.round((0.50 * cal) / 4),
      fats:   Math.round((0.20 * cal) / 9),
      fiber:  25
    };
  }
}

// ===== View: робота з DOM =====
class StatsView {
  constructor() {
    // Inputs
    this.genderTabs   = [...document.querySelectorAll('.gender-tabs .tab')];
    this.yearSlider   = document.getElementById('year-slider');
    this.yearValue    = document.getElementById('year-value');
    this.heightSlider = document.getElementById('height-slider');
    this.heightValue  = document.getElementById('height-value');
    this.weightSlider = document.getElementById('weight-slider');
    this.weightValue  = document.getElementById('weight-value');
    this.activitySel  = document.getElementById('activity-select');
    this.activityDesc = document.getElementById('activity-desc');
    this.fatSlider    = document.getElementById('fat-slider');
    this.fatValue     = document.getElementById('fat-value');

    this.goalTabs     = [...document.querySelectorAll('.goal-tabs .tab')];
    this.goalSlider   = document.getElementById('goal-slider');
    this.goalValue    = document.getElementById('goal-value');

    // Outputs
    this.bmiValue     = document.getElementById('bmi-value');
    this.scaleDots    = [...document.querySelectorAll('.bmi-dot')];
    this.bmiStatus    = document.getElementById('bmi-status');

    this.protsGrams   = document.getElementById('prots-grams');
    this.carbsGrams   = document.getElementById('carbs-grams');
    this.fatsGrams    = document.getElementById('fats-grams');
    this.fiberGrams   = document.getElementById('fiber-grams');
    this.protsPct     = document.getElementById('prots-pct');
    this.carbsPct     = document.getElementById('carbs-pct');
    this.fatsPct      = document.getElementById('fats-pct');
    this.fiberPct     = document.getElementById('fiber-pct');

    this.infoBtns     = [...document.querySelectorAll('.info-btn')];
  }

  // Зчитуємо всі значення
  getInputs() {
    const gender   = this.genderTabs.find(t => t.classList.contains('active')).dataset.gender;
    const year     = +this.yearSlider.value;
    const height   = +this.heightSlider.value;
    const weight   = +this.weightSlider.value;
    const activity = this.activitySel.value;
    const goal     = this.goalTabs.find(t => t.classList.contains('active')).dataset.goal;
    const age      = new Date().getFullYear() - year;
    return { gender, year, height, weight, age, activity, goal };
  }

  // Підписуємо усі події
  bindAll(handler) {
    // таби стать
    this.genderTabs.forEach(tab =>
      tab.addEventListener('click', () => {
        this.genderTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        handler();
      })
    );

    // таби цілі
    this.goalTabs.forEach(tab =>
      tab.addEventListener('click', () => {
        this.goalTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        handler();
      })
    );

    // слайдери
    [
      this.yearSlider,
      this.heightSlider,
      this.weightSlider,
      this.goalSlider,
      this.fatSlider
    ].forEach(slider =>
      slider.addEventListener('input', () => {
        this.syncLabels();
        handler();
      })
    );

    // зміна активності
    this.activitySel.addEventListener('change', () => {
      this.updateActivityDesc();
      handler();
    });

    // info-кнопки
    this.infoBtns.forEach(btn =>
      btn.addEventListener('click', () => {
        const txt = document.getElementById(btn.dataset.target);
        txt.classList.toggle('visible');
      })
    );
  }

  // Оновлюємо підписи біля повзунків
  syncLabels() {
    this.yearValue.textContent   = this.yearSlider.value;
    this.heightValue.textContent = this.heightSlider.value;
    this.weightValue.textContent = this.weightSlider.value;
    this.goalValue.textContent   = `${this.goalSlider.value}.0 кг`;
    this.fatValue.textContent    = `${this.fatSlider.value} %`;
  }

  // Опис рівня активності
  updateActivityDesc() {
    const map = {
      sedentary: 'Переважно сидячий спосіб життя.',
      light:     '1–3 тренування/тиждень.',
      moderate:  '3–5 тренувань/тиждень.',
      heavy:     '6–7 тренувань/тиждень.',
      extreme:   'Щоденні інтенсивні тренування.'
    };
    this.activityDesc.textContent = map[this.activitySel.value];
  }

  // Відображаємо BMI і макроси
  render({ bmi, bmiStatus, macros }) {
    // BMI
    this.bmiValue.textContent = bmi.toFixed(2);
    this.scaleDots.forEach(dot => dot.classList.remove('active'));
    this.scaleDots[bmiStatus.idx].classList.add('active');
    this.bmiStatus.textContent = bmiStatus.label;

    // Макроси та %
    this.protsGrams.textContent = macros.prots;
    this.carbsGrams.textContent = macros.carbs;
    this.fatsGrams.textContent  = macros.fats;
    this.fiberGrams.textContent = macros.fiber;

    const totalCal = macros.prots*4 + macros.carbs*4 + macros.fats*9 + macros.fiber*2;
    this.protsPct.textContent  = `${Math.round(macros.prots*4/totalCal*100)}%`;
    this.carbsPct.textContent  = `${Math.round(macros.carbs*4/totalCal*100)}%`;
    this.fatsPct.textContent   = `${Math.round(macros.fats*9/totalCal*100)}%`;
    this.fiberPct.textContent  = `${Math.round(macros.fiber*2/totalCal*100)}%`;
  }
}

// ===== Controller =====
document.addEventListener('DOMContentLoaded', () => {
  const view = new StatsView();
  const update = () => {
    const inputs   = view.getInputs();
    const model    = new StatsModel(inputs);
    const bmi      = model.calcBMI();
    const bmiStat  = model.getBmiStatus();
    const macros   = model.calcMacros();
    view.render({ bmi, bmiStatus: bmiStat, macros });
  };

  view.syncLabels();
  view.updateActivityDesc();
  view.bindAll(update);
  update();
});
