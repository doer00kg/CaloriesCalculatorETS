// верхній header nav
document.addEventListener('DOMContentLoaded', () => {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');

  if (settingsBtn && settingsMenu) {
    settingsBtn.addEventListener('click', () => {
      settingsMenu.classList.toggle('hidden');
    });

    // Закривати при кліку поза меню
    document.addEventListener('click', (e) => {
      if (!settingsBtn.contains(e.target) && !settingsMenu.contains(e.target)) {
        settingsMenu.classList.add('hidden');
      }
    });
  }
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
  const loginTab = document.getElementById('loginTab');
  const submitBtn = document.getElementById('submitBtn');
  const authForm = document.getElementById('authForm');

  // Якщо хоча б один з елементів відсутній, припинити виконання
  if (!registerTab || !loginTab || !submitBtn || !authForm) {
    return;
  }

  // Початковий режим - реєстрація
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  authForm.action = 'php/register.php';
  submitBtn.textContent = 'Зареєструватися';

  // Перемикання на «Реєстрація»
  registerTab.addEventListener('click', () => {
    authForm.action = 'php/register.php';
    submitBtn.textContent = 'Зареєструватися';
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
  });

  // Перемикання на «Вхід»
  loginTab.addEventListener('click', () => {
    authForm.action = 'php/login.php';
    submitBtn.textContent = 'Увійти';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  });

  // Функція відображення помилки
  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    if (!input) return;
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
    this.genderTabs   = [...document.querySelectorAll('.gender-tabs .tab-stats')];
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

    this.goalTabs     = [...document.querySelectorAll('.goal-tabs .tab-stats')];
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
  // Сначала подгружаем данные из PHP
  fetch('php/load.php')
    .then(res => res.json())
    .then(data => {
      if (!data) {
        // Если данных нет, просто инициализируем вид+модель по умолчанию
        initStatsController();
        return;
      }

      // ——————————————————————————————————————————————————————————
      // 1. Устанавливаем состояние DOM по данным из fetch
      // ——————————————————————————————————————————————————————————

      // 1.1. Пол (кнопки)
      const sex = data.sex === 'M' ? 'male' : 'female';
      document.querySelectorAll('[data-gender]').forEach(btn => {
        if (btn.dataset.gender === sex) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      // (если у вас есть скрытый inputSex – можно обновить его значение, но StatsView.getInputs
      // сам возьмет активную кнопку)
      const inputSex = document.getElementById('inputSex');
      if (inputSex) {
        inputSex.value = sex;
      }

      // 1.2. Цель (кнопки)
      const goalMap = { 1: 'lose', 2: 'gain', 3: 'maintain' };
      const goal = goalMap[data.goal] || 'maintain';
      document.querySelectorAll('[data-goal]').forEach(btn => {
        if (btn.dataset.goal === goal) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      const inputGoal = document.getElementById('inputGoal');
      if (inputGoal) {
        inputGoal.value = goal;
      }

      // 1.3. Слайдер «Год рождения» (year-slider → year and year-value)
      const yearSlider = document.getElementById('year-slider');
      const yearValue = document.getElementById('year-value');
      if (yearSlider && yearValue) {
        // В поле "data.age" приходит год рождения
        yearSlider.value = data.age;
        yearValue.textContent = data.age;
      }

      // 1.4. Слайдер «Рост»
      const heightSlider = document.getElementById('height-slider');
      const heightValue = document.getElementById('height-value');
      if (heightSlider && heightValue) {
        heightSlider.value = data.height;
        heightValue.textContent = data.height;
      }

      // 1.5. Слайдер «Вес»
      const weightSlider = document.getElementById('weight-slider');
      const weightValue = document.getElementById('weight-value');
      if (weightSlider && weightValue) {
        weightSlider.value = data.weight;
        weightValue.textContent = data.weight;
      }

      // 1.6. Слайдер «Жир (%)»
      const fatSlider = document.getElementById('fat-slider');
      const fatValue = document.getElementById('fat-value');
      if (fatSlider && fatValue) {
        fatSlider.value = data.fats;
        fatValue.textContent = data.fats + ' %';
      }

      // 1.7. Слайдер «Целевой вес»
      const goalSlider = document.getElementById('goal-slider');
      const goalValue = document.getElementById('goal-value');
      if (goalSlider && goalValue) {
        goalSlider.value = data.goal_weight;
        goalValue.textContent = data.goal_weight + ' кг';
      }

      // 1.8. Выбор активности
      const activitySelect = document.getElementById('activity-select');
      const activityDesc  = document.getElementById('activity-desc');
      if (activitySelect) {
        activitySelect.value = data.activity_level.toString();
      }
      // Обновим текст описания активности (если есть маппинг в StatsView, можно вызвать updateActivityDesc)
      if (activityDesc && activitySelect) {
        const map = {
          sedentary: 'Сидячий способ життя.',
          light:     '1–3 тренування/тиждень.',
          moderate:  '3–5 тренувань/тиждень.',
          heavy:     '6–7 тренувань/тиждень.',
          extreme:   'Щоденні інтенсивні тренування.'
        };
        activityDesc.textContent = map[activitySelect.value] || '';
      }

      // ——————————————————————————————————————————————————————————
      // 2. Запускаем существующий контроллер (StatsView + StatsModel + биндинги)
      // ——————————————————————————————————————————————————————————
      initStatsController();
    })
    .catch(err => {
      console.error('Ошибка загрузки данных из PHP:', err);
      // Если fetch упал — просто запустим контроллер без предзаполнения
      initStatsController();
    });

  // Общая функция-инициализатор: вызывает StatsView, бинды и начальный рендер
  function initStatsController() {
    const view = new StatsView();

    // Функция, которая делает расчет и передает в render
    const update = () => {
      const inputs = view.getInputs();
      const model  = new StatsModel(inputs);
      const bmi    = model.calcBMI();
      const bmiStat = model.getBmiStatus();
      const macros = model.calcMacros();
      view.render({ bmi, bmiStatus: bmiStat, macros });
    };

    // Синхронизируем подписи слайдеров сразу после установки их значений
    view.syncLabels();
    view.updateActivityDesc();

    // Навешиваем обработчики на элементы (табы, слайдеры, select и т.д.)
    view.bindAll(update);

    // Делаем первый расчет
    update();
  }
});

// ---------------------------------------------
// =======================================
//              ДАНІ (dataList)
// =======================================
// Масив із усіма «картками» — і для рецептів, і для продуктів.
// Кожен об’єкт має поля:
//   kind:     "recipes" | "products"          — визначає, куди рендерити
//   category: назва категорії ("soups", "rice", "meats", "fish", "desserts",
//                              "meat", "veggies", "fish", "grains")
//   title:    заголовок страви/продукту
//   imgSrc:   шлях до зображення (тут зберігаємо точно так, як було в HTML)
//   imgAlt:   alt-текст
//   summary:  короткий опис + калорійність (той <p> перед кнопкою "Детальніше")
//   ingredients: рядок зі списком інгредієнтів (без тега <strong>)
//   macros:   рядок із БЖУ у форматі "Білки: X г | Жири: Y г | Вуглеводи: Z г"
// Для продуктів (kind === "products") замість macros може бути "Ккал: XX ккал / 100 г | Білки: … | Жири: … | Вуглеводи: …"
// ----------------------------------------------------------------------------------------
const dataList = [
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Овочевий суп",
    "imgSrc": "images/ovochevyy_soup.jpg",
    "imgAlt": "Овочевий суп",
    "summary": "120 ккал. Смачний суп із сезонних овочів.",
    "ingredients": "картопля, морква, цибуля, зелень",
    "macros": "Білки: 3 г | Жири: 2 г | Вуглеводи: 15 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Грибний крем-суп",
    "imgSrc": "images/grybniy_soup.jpg",
    "imgAlt": "Грибний крем-суп",
    "summary": "110 ккал. Ароматний суп із білих грибів і вершків.",
    "ingredients": "печериці, картопля, вершки",
    "macros": "Білки: 3 г | Жири: 7 г | Вуглеводи: 8 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Гарбузовий крем-суп",
    "imgSrc": "images/garbuzovy_soup.jpg",
    "imgAlt": "Гарбузовий крем-суп",
    "summary": "105 ккал. Кремовий суп з вершками і гарбузом",
    "ingredients": "гарбуз, вершки, цибуля, сіль, мускатний горіх",
    "macros": "Білки: 2 г | Жири: 5 г | Вуглеводи: 12 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Курячий бульйон",
    "imgSrc": "images/kuryachy_soup.jpg",
    "imgAlt": "Курячий бульйон",
    "summary": "85 ккал. Легкий бульйон з куркою та зеленню",
    "ingredients": "курка, морква, цибуля, селера, зелень",
    "macros": "Білки: 7 г | Жири: 3 г | Вуглеводи: 2 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Томатний суп",
    "imgSrc": "images/tomat_soup.jpg",
    "imgAlt": "Томатний суп",
    "summary": "95 ккал. Кисло-солодкий суп із свіжих томатів",
    "ingredients": "помідори, базилік, часник, цибуля",
    "macros": "Білки: 2 г | Жири: 3 г | Вуглеводи: 14 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Суп-пюре з цвітної капусти",
    "imgSrc": "images/kapusta_soup.jpg",
    "imgAlt": "Суп-пюре з цвітної капусти",
    "summary": "98 ккал. Легка страва з м’яким смаком.",
    "ingredients": "цвітна капуста, молоко, часник, сіль",
    "macros": "Білки: 3 г | Жири: 5 г | Вуглеводи: 10 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Гаспачо",
    "imgSrc": "images/gaspacho_soup.jpg",
    "imgAlt": "Гаспачо",
    "summary": "70 ккал. Холодний іспанський суп зі свіжих овочів.",
    "ingredients": "помідори, огірок, перець, оливкова олія",
    "macros": "Білки: 2 г | Жири: 3 г | Вуглеводи: 9 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Суп з квасолею",
    "imgSrc": "images/kvasolya_soup.jpg",
    "imgAlt": "Суп з квасолею",
    "summary": "145 ккал. Поживний суп з білою квасолею.",
    "ingredients": "біла квасоля, морква, сіль, цибуля",
    "macros": "Білки: 8 г | Жири: 4 г | Вуглеводи: 18 г"
  },
  {
    "kind": "recipes",
    "category": "soups",
    "title": "Сирний суп з грибами",
    "imgSrc": "images/syr_gryb_soup.jpg",
    "imgAlt": "Сирний суп з грибами",
    "summary": "160 ккал. Насичений смаком суп з плавленим сиром.",
    "ingredients": "печериці, сир плавлений, картопля, вершки",
    "macros": "Білки: 6 г | Жири: 10 г | Вуглеводи: 18 г"
  },

  // ========== Рис і локшина ==========
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Рис з овочами",
    "imgSrc": "images/rice_ovoch.jpg",
    "imgAlt": "Рис з овочами",
    "summary": "130 ккал. Смажений рис з морквою та горошком",
    "ingredients": "рис, морква, зелений горошок, кукурудза, соєвий соус",
    "macros": "Білки: 5 г | Жири: 3 г | Вуглеводи: 35 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Локшина з тофу",
    "imgSrc": "images/lokshyn_tofu.jpg",
    "imgAlt": "Локшина з тофу",
    "summary": "180 ккал. Локшина з овочами та соєвим соусом",
    "ingredients": "локшина, тофу, броколі, морква, соєвий соус",
    "macros": "Білки: 10 г | Жири: 6 г | Вуглеводи: 30 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Плов з куркою",
    "imgSrc": "images/plovkyrka_tofu.jpg",
    "imgAlt": "Плов з куркою",
    "summary": "210 ккал. Ароматний плов з курячим м’ясом",
    "ingredients": "рис, куряче філе, морква, цибуля, спеції",
    "macros": "Білки: 12 г | Жири: 8 г | Вуглеводи: 24 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Фунчоза з овочами",
    "imgSrc": "images/funzhoza.jpg",
    "imgAlt": "Фунчоза з овочами",
    "summary": "140 ккал. Легка азіатська страва з рисової локшини",
    "ingredients": "фунчоза, перець, огірок, морква, кунжут",
    "macros": "Білки: 3 г | Жири: 2 г | Вуглеводи: 28 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Рис з креветками",
    "imgSrc": "images/ricekryvetka.jpg",
    "imgAlt": "Рис з креветками",
    "summary": "190 ккал. Морський рис з ароматними спеціями",
    "ingredients": "рис, креветки, часник, соєвий соус, зелень",
    "macros": "Білки: 11 г | Жири: 4 г | Вуглеводи: 27 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Смажений рис з яйцем",
    "imgSrc": "images/riceyayze.jpg",
    "imgAlt": "Смажений рис з яйцем",
    "summary": "160 ккал. Класичний азіатський рис",
    "ingredients": "варений рис, яйце, зелений лук, соєвий соус",
    "macros": "Білки: 6 г | Жири: 5 г | Вуглеводи: 22 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Соба з грибами",
    "imgSrc": "images/soba.jpg",
    "imgAlt": "Соба з грибами",
    "summary": "160 ккал. Гречана локшина соба з печерицями в соєво-кунжутному соусі.",
    "ingredients": "локшина соба, печериці, соєвий соус, кунжут, цибуля",
    "macros": "Білки: 6 г | Жири: 4 г | Вуглеводи: 23 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Кисло-солодка локшина",
    "imgSrc": "images/kyslosolodka.jpg",
    "imgAlt": "Кисло-солодка локшина",
    "summary": "185 ккал. Локшина у пікантному кисло-солодкому соусі з овочами.",
    "ingredients": "локшина, перець, ананас, морква, соус чилі, томатна паста",
    "macros": "Білки: 5 г | Жири: 6 г | Вуглеводи: 28 г"
  },
  {
    "kind": "recipes",
    "category": "rice",
    "title": "Локшина з куркою по-тайськи",
    "imgSrc": "images/lokshynatai.jpg",
    "imgAlt": "Локшина з куркою по-тайськи",
    "summary": "250 ккал. Пряна локшина з соусом та арахісом",
    "ingredients": "рисова локшина, курка, соус пад тай, арахіс, лайм",
    "macros": "Білки: 13 г | Жири: 10 г | Вуглеводи: 28 г"
  },

  // ========== М'ясні страви ==========
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Курка гриль",
    "imgSrc": "images/kyrka_grill.jpg",
    "imgAlt": "Курка гриль",
    "summary": "200 ккал. Запечена курка з прянощами",
    "ingredients": "курка, спеції, оливкова олія",
    "macros": "Білки: 25 г | Жири: 10 г | Вуглеводи: 0 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Тефтелі з індички",
    "imgSrc": "images/teftely_indychka.jpg",
    "imgAlt": "Тефтелі з індички",
    "summary": "150 ккал. Індичка в томатному соусі",
    "ingredients": "індичка, яйце, панірувальні сухарі, томатний соус, спеції",
    "macros": "Білки: 20 г | Жири: 8 г | Вуглеводи: 5 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Стейк із яловичини",
    "imgSrc": "images/staykyalovych.jpg",
    "imgAlt": "Стейк із яловичини",
    "summary": "250 ккал. Соковитий стейк середньої прожарки.",
    "ingredients": "яловичина, оливкова олія, розмарин, сіль, перець",
    "macros": "Білки: 26 г | Жири: 16 г | Вуглеводи: 0 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Котлета по-київськи",
    "imgSrc": "images/kiyvkotlet.jpg",
    "imgAlt": "Котлета по-київськи",
    "summary": "290 ккал. Соковита куряча котлета з маслом усередині.",
    "ingredients": "куряче філе, вершкове масло, панірувальні сухарі, яйце, борошно",
    "macros": "Білки: 22 г | Жири: 18 г | Вуглеводи: 10 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Печеня зі свинини",
    "imgSrc": "images/pechenya.jpg",
    "imgAlt": "Печеня зі свинини",
    "summary": "320 ккал. Ароматна мʼясна печеня з овочами.",
    "ingredients": "свинина, картопля, морква, цибуля, спеції",
    "macros": "Білки: 22 г | Жири: 20 г | Вуглеводи: 12 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Гуляш із телятини",
    "imgSrc": "images/gulyash.jpg",
    "imgAlt": "Гуляш із телятини",
    "summary": "230 ккал. Насичений угорський гуляш із м’якою телятиною.",
    "ingredients": "телятина, цибуля, паприка, томати, спеції",
    "macros": "Білки: 24 г | Жири: 12 г | Вуглеводи: 6 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Курячі стегенця в духовці",
    "imgSrc": "images/kyrachistegna.jpg",
    "imgAlt": "Курячі стегенця в духовці",
    "summary": "260 ккал. Запечені в маринаді з трав.",
    "ingredients": "курячі стегенця, гірчиця, мед, соєвий соус, часник",
    "macros": "Білки: 23 г | Жири: 17 г | Вуглеводи: 5 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Мʼясо по-французьки",
    "imgSrc": "images/pofranzu.jpg",
    "imgAlt": "Мʼясо по-французьки",
    "summary": "330 ккал. Запечена свинина з сиром та овочами.",
    "ingredients": "свинина, цибуля, помідори, сир, майонез",
    "macros": "Білки: 21 г | Жири: 25 г | Вуглеводи: 7 г"
  },
  {
    "kind": "recipes",
    "category": "meats",
    "title": "Свинячі реберця BBQ",
    "imgSrc": "images/bbq.jpg",
    "imgAlt": "Свінячі реберця BBQ",
    "summary": "350 ккал. Пікантні ребра в соусі барбекю.",
    "ingredients": "свинячі ребра, соус BBQ, спеції",
    "macros": "Білки: 22 г | Жири: 28 г | Вуглеводи: 7 г"
  },

  // ========== Риба і морепродукти (рецепти) ==========
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Запечений лосось",
    "imgSrc": "images/sapechenyi_losos.jpg",
    "imgAlt": "Запечений лосось",
    "summary": "220 ккал. Лосось із лимоном та зеленню",
    "ingredients": "лосось, лимон, зелень, оливкова олія",
    "macros": "Білки: 23 г | Жири: 15 г | Вуглеводи: 0 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Тунець на грилі",
    "imgSrc": "images/tunets_grill.jpg",
    "imgAlt": "Тунець на грилі",
    "summary": "180 ккал. Філе тунця на грилі",
    "ingredients": "філе тунця, спеції, лимон",
    "macros": "Білки: 23 г | Жири: 15 г | Вуглеводи: 0 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Риба в карі соусі",
    "imgSrc": "images/riba_kary.jpg",
    "imgAlt": "Риба в карі соусі",
    "summary": "210 ккал. Пікантна риба в кокосовому соусі карі",
    "ingredients": "біла риба, кокосове молоко, паста карі, цибуля",
    "macros": "Білки: 22 г | Жири: 13 г | Вуглеводи: 5 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Крабовий салат",
    "imgSrc": "images/kraby_salat.jpg",
    "imgAlt": "Крабовий салат",
    "summary": "150 ккал. Легкий салат з крабовими паличками",
    "ingredients": "крабові палички, кукурудза, рис, яйце, майонез",
    "macros": "Білки: 12 г | Жири: 7 г | Вуглеводи: 12 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Креветки з часником",
    "imgSrc": "images/krevetky_chasnyk.jpg",
    "imgAlt": "Креветки з часником",
    "summary": "170 ккал. Смажені креветки з часником та зеленню",
    "ingredients": "креветки, часник, петрушка, оливкова олія",
    "macros": "Білки: 20 г | Жири: 10 г | Вуглеводи: 1 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Кальмари на грилі",
    "imgSrc": "images/kalmary_gril.jpg",
    "imgAlt": "Кальмари на грилі",
    "summary": "160 ккал. Соковиті кальмари зі спеціями",
    "ingredients": "кальмари, лимон, часник, зелень",
    "macros": "Білки: 21 г | Жири: 6 г | Вуглеводи: 2 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Рибні тефтелі",
    "imgSrc": "images/rybni_tefteli.jpg",
    "imgAlt": "Рибні тефтелі",
    "summary": "190 ккал. Тефтелі з білої риби в соусі",
    "ingredients": "філе риби, яйце, цибуля, томатний соус",
    "macros": "Білки: 18 г | Жири: 9 г | Вуглеводи: 7 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Морський коктейль",
    "imgSrc": "images/kokteil_morsk.jpg",
    "imgAlt": "Морський коктейль",
    "summary": "200 ккал. Мікс морепродуктів у вершковому соусі",
    "ingredients": "мідії, кальмари, креветки, вершки",
    "macros": "Білки: 22 г | Жири: 12 г | Вуглеводи: 3 г"
  },
  {
    "kind": "recipes",
    "category": "fish",
    "title": "Суші з лососем",
    "imgSrc": "images/rolly_losos.jpg",
    "imgAlt": "Суші з лососем",
    "summary": "210 ккал. Класичні роли з рисом та сирим лососем",
    "ingredients": "рис, лосось, норі, рисовий оцет",
    "macros": "Білки: 18 г | Жири: 8 г | Вуглеводи: 20 г"
  },

  // ========== Десерти та напої ==========
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Фруктовий салат",
    "imgSrc": "images/fruktoviy_salat.jpg",
    "imgAlt": "Фруктовий салат",
    "summary": "90 ккал. Салат з яблуками, бананом і ківі",
    "ingredients": "яблуко, банан, ківі, йогурт",
    "macros": "Білки: 2 г | Жири: 1 г | Вуглеводи: 22 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Йогуртовий мус",
    "imgSrc": "images/yogurt_muss.jpg",
    "imgAlt": "Йогуртовий мус",
    "summary": "110 ккал. Легкий десерт із йогурту та ягід",
    "ingredients": "йогурт, полуниця, малина, мед, желатин",
    "macros": "Білки: 4 г | Жири: 3 г | Вуглеводи: 15 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Шоколадний пудинг",
    "imgSrc": "images/shokoladnyi_puding.jpg",
    "imgAlt": "Шоколадний пудинг",
    "summary": "180 ккал. Кремовий пудинг з чорного шоколаду",
    "ingredients": "темний шоколад, молоко, крохмаль, цукор",
    "macros": "Білки: 4 г | Жири: 9 г | Вуглеводи: 20 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Сирники",
    "imgSrc": "images/syrnyky.jpg",
    "imgAlt": "Сирники",
    "summary": "230 ккал. Традиційна страва з сиру",
    "ingredients": "сир, яйце, борошно, ваніль",
    "macros": "Білки: 10 г | Жири: 10 г | Вуглеводи: 20 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Сирна запіканка",
    "imgSrc": "images/zapikanka.jpg",
    "imgAlt": "Сирна запіканка",
    "summary": "200 ккал. Десерт з сиру та манки",
    "ingredients": "сир, яйця, манка, родзинки",
    "macros": "Білки: 12 г | Жири: 8 г | Вуглеводи: 18 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Зелений смузі",
    "imgSrc": "images/zelenyy_smuzi.jpg",
    "imgAlt": "Зелений смузі",
    "summary": "95 ккал. Напій з шпинатом, яблуком і бананом",
    "ingredients": "шпинат, яблуко, банан, вода",
    "macros": "Білки: 2 г | Жири: 0.5 г | Вуглеводи: 22 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Апельсиновий сік",
    "imgSrc": "images/sik_z_apelsyna.jpg",
    "imgAlt": "Апельсиновий сік",
    "summary": "45 ккал. Свіжовичавлений сік",
    "ingredients": "апельсини",
    "macros": "Білки: 1 г | Жири: 0 г | Вуглеводи: 10 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Молочний коктейль",
    "imgSrc": "images/molochnyi_kokteil.jpg",
    "imgAlt": "Молочний коктейль",
    "summary": "150 ккал. Напій з молока та банану",
    "ingredients": "молоко, банан, мед",
    "macros": "Білки: 6 г | Жири: 4 г | Вуглеводи: 24 г"
  },
  {
    "kind": "recipes",
    "category": "desserts",
    "title": "Кава з молоком",
    "imgSrc": "images/kava.jpg",
    "imgAlt": "Кава з молоком",
    "summary": "60 ккал. Класичне поєднання",
    "ingredients": "кава, молоко, цукор",
    "macros": "Білки: 2 г | Жири: 2 г | Вуглеводи: 8 г"
  },

  // ========== ПРОДУКТИ: М'ясо ==========
  {
    "kind": "products",
    "category": "meat",
    "title": "Яловичина",
    "imgSrc": "images/yalovychyna.jpg",
    "imgAlt": "Яловичина",
    "summary": "200 ккал / 100г. Багата на білок.",
    "ingredients": "",
    "macros": "Ккал: 200 ккал / 100 г | Білки: 26 г | Жири: 20 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Свинина",
    "imgSrc": "images/svynyna.jpg",
    "imgAlt": "Свинина",
    "summary": "260 ккал / 100г. Жирне червоне м’ясо.",
    "ingredients": "",
    "macros": "Ккал: 260 ккал / 100 г | Білки: 24 г | Жири: 30 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Курка",
    "imgSrc": "images/kurka.jpg",
    "imgAlt": "Курка",
    "summary": "190 ккал / 100г. Дієтичне біле м’ясо.",
    "ingredients": "",
    "macros": "Ккал: 190 ккал / 100 г | Білки: 27 г | Жири: 5 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Індичка",
    "imgSrc": "images/indyka.jpg",
    "imgAlt": "Індичка",
    "summary": "160 ккал / 100г. Нежирне м’ясо, добре засвоюється.",
    "ingredients": "",
    "macros": "Ккал: 160 ккал / 100 г | Білки: 29 г | Жири: 4 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Телятина",
    "imgSrc": "images/telyatyna.jpg",
    "imgAlt": "Телятина",
    "summary": "150 ккал / 100г. М’яке м’ясо, багате на залізо.",
    "ingredients": "",
    "macros": "Ккал: 150 ккал / 100 г | Білки: 20 г | Жири: 8 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Кролятина",
    "imgSrc": "images/kravets.jpg",
    "imgAlt": "Кролятина",
    "summary": "170 ккал / 100г. Легке м’ясо з низьким вмістом холестерину.",
    "ingredients": "",
    "macros": "Ккал: 170 ккал / 100 г | Білки: 21 г | Жири: 3 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Сало",
    "imgSrc": "images/salo.jpg",
    "imgAlt": "Сало",
    "summary": "770 ккал / 100г. Жирова енергія.",
    "ingredients": "",
    "macros": "Ккал: 770 ккал / 100 г | Білки: 37 г | Жири: 35 г | Вуглеводи: 1 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Баранина",
    "imgSrc": "images/baranina.jpg",
    "imgAlt": "Баранина",
    "summary": "250 ккал / 100г. Жирне червоне м’ясо.",
    "ingredients": "",
    "macros": "Ккал: 250 ккал / 100 г | Білки: 25 г | Жири: 18 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "meat",
    "title": "Печінка яловича",
    "imgSrc": "images/pechinka.jpg",
    "imgAlt": "Печінка яловича",
    "summary": "119 ккал / 100г. Багато вітамінів.",
    "ingredients": "",
    "macros": "Ккал: 119 ккал / 100 г | Білки: 20 г | Жири: 3 г | Вуглеводи: 2 г"
  },

  // ========== Овочі і фрукти ==========
  {
    "kind": "products",
    "category": "veggies",
    "title": "Яблуко",
    "imgSrc": "images/yabluko.jpg",
    "imgAlt": "Яблуко",
    "summary": "52 ккал / 100г. Свіже фруктове.",
    "ingredients": "",
    "macros": "Ккал: 52 ккал / 100 г | Білки: 0.3 г | Жири: 0.2 г | Вуглеводи: 14 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Банан",
    "imgSrc": "images/banan.jpg",
    "imgAlt": "Банан",
    "summary": "89 ккал / 100г. Солодкий фрукт.",
    "ingredients": "",
    "macros": "Ккал: 89 ккал / 100 г | Білки: 1.1 г | Жири: 0.3 г | Вуглеводи: 23 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Морква",
    "imgSrc": "images/morkva.jpg",
    "imgAlt": "Морква",
    "summary": "41 ккал / 100г. Багата на бета-каротин.",
    "ingredients": "",
    "macros": "Ккал: 41 ккал / 100 г | Білки: 0.9 г | Жири: 0.2 г | Вуглеводи: 10 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Огірок",
    "imgSrc": "images/ogirok.jpg",
    "imgAlt": "Огірок",
    "summary": "16 ккал / 100г. Низькокалорійний овоч.",
    "ingredients": "",
    "macros": "Ккал: 16 ккал / 100 г | Білки: 0.7 г | Жири: 0.1 г | Вуглеводи: 3.6 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Помідор",
    "imgSrc": "images/pomidor.jpg",
    "imgAlt": "Помідор",
    "summary": "18 ккал / 100г. Джерело лікофену.",
    "ingredients": "",
    "macros": "Ккал: 18 ккал / 100 г | Білки: 0.9 г | Жири: 0.2 г | Вуглеводи: 3.9 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Броколі",
    "imgSrc": "images/broccoli.jpg",
    "imgAlt": "Броколі",
    "summary": "34 ккал / 100г. Багата на вітамін C.",
    "ingredients": "",
    "macros": "Ккал: 34 ккал / 100 г | Білки: 2.8 г | Жири: 0.4 г | Вуглеводи: 7 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Авокадо",
    "imgSrc": "images/avokado.jpg",
    "imgAlt": "Авокадо",
    "summary": "83 ккал / 100г (в сирому вигляді). Культура зернових.",
    "ingredients": "",
    "macros": "Ккал: 83 ккал / 100 г | Білки: 3.1 г | Жири: 0.2 г | Вуглеводи: 18.6 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Ківі",
    "imgSrc": "images/kyv.jpg",
    "imgAlt": "Ківі",
    "summary": "50 ккал / 100г. Сезонний мікс ягід.",
    "ingredients": "",
    "macros": "Ккал: 50 ккал / 100 г | Білки: 0.7 г | Жири: 0.3 г | Вуглеводи: 11 г"
  },
  {
    "kind": "products",
    "category": "veggies",
    "title": "Капуста",
    "imgSrc": "images/kapusta.jpg",
    "imgAlt": "Капуста",
    "summary": "15 ккал / 100г. Низькокалорійний овоч.",
    "ingredients": "",
    "macros": "Ккал: 15 ккал / 100 г | Білки: 1.4 г | Жири: 0.2 г | Вуглеводи: 2.9 г"
  },

  // ========== Риба і морепродукти (продукти) ==========
  {
    "kind": "products",
    "category": "fish",
    "title": "Лосось (свіжий)",
    "imgSrc": "images/losos.jpg",
    "imgAlt": "Лосось (свіжий)",
    "summary": "208 ккал / 100г. Жирна морська риба.",
    "ingredients": "",
    "macros": "Ккал: 208 ккал / 100 г | Білки: 20 г | Жири: 13 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Тунець",
    "imgSrc": "images/tunec.jpg",
    "imgAlt": "Тунець",
    "summary": "132 ккал / 100г. Пісна океанічна риба.",
    "ingredients": "",
    "macros": "Ккал: 132 ккал / 100 г | Білки: 28 г | Жири: 1.3 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Креветки",
    "imgSrc": "images/korolivska_krevetka.jpg",
    "imgAlt": "Креветки",
    "summary": "99 ккал / 100г. Мінерали та йод.",
    "ingredients": "",
    "macros": "Ккал: 99 ккал / 100 г | Білки: 24 г | Жири: 0.3 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Кальмари",
    "imgSrc": "images/kalmari.jpg",
    "imgAlt": "Кальмари",
    "summary": "92 ккал / 100г. Низькокалорійний морепродукт.",
    "ingredients": "",
    "macros": "Ккал: 92 ккал / 100 г | Білки: 16 г | Жири: 1.4 г | Вуглеводи: 3.1 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Мідії",
    "imgSrc": "images/mydii.jpg",
    "imgAlt": "Мідії",
    "summary": "172 ккал / 100г. Безліч амінокислот.",
    "ingredients": "",
    "macros": "Ккал: 172 ккал / 100 г | Білки: 24 г | Жири: 4.5 г | Вуглеводи: 7.4 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Осетр",
    "imgSrc": "images/osetr.jpg",
    "imgAlt": "Осетр",
    "summary": "144 ккал / 100г. Морський продукт.",
    "ingredients": "",
    "macros": "Ккал: 144 ккал / 100 г | Білки: 23 г | Жири: 5 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Карась",
    "imgSrc": "images/karas.jpg",
    "imgAlt": "Карась",
    "summary": "75 ккал / 100г. Легкий дієтичний білок.",
    "ingredients": "",
    "macros": "Ккал: 75 ккал / 100 г | Білки: 16 г | Жири: 0.5 г | Вуглеводи: 0 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Скумбрія",
    "imgSrc": "images/skumbria.jpg",
    "imgAlt": "Скумбрія",
    "summary": "95 ккал / 100г. Живна риба з Омега-3.",
    "ingredients": "",
    "macros": "Ккал: 95 ккал / 100 г | Білки: 8 г | Жири: 1 г | Вуглеводи: 12 г"
  },
  {
    "kind": "products",
    "category": "fish",
    "title": "Хек",
    "imgSrc": "images/khek.jpg",
    "imgAlt": "Хек",
    "summary": "200 ккал / 100г. Дієтична біла риба.",
    "ingredients": "",
    "macros": "Ккал: 200 ккал / 100 г | Білки: 10 г | Жири: 7 г | Вуглеводи: 26 г"
  },

  // ========== Крупи ==========
  {
    "kind": "products",
    "category": "grains",
    "title": "Рис",
    "imgSrc": "images/ris.jpg",
    "imgAlt": "Рис",
    "summary": "130 ккал / 100г. Основний інгредієнт.",
    "ingredients": "",
    "macros": "Ккал: 130 ккал / 100 г | Білки: 2.7 г | Жири: 0.3 г | Вуглеводи: 28 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Гречка",
    "imgSrc": "images/grechka.jpg",
    "imgAlt": "Гречка",
    "summary": "110 ккал / 100г. Безглютенова.",
    "ingredients": "",
    "macros": "Ккал: 110 ккал / 100 г | Білки: 3.4 г | Жири: 1 г | Вуглеводи: 20 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Овес (хлоп'я)",
    "imgSrc": "images/oves.jpg",
    "imgAlt": "Овес (хлоп'я)",
    "summary": "389 ккал / 100г (сухий). Суперфуд.",
    "ingredients": "",
    "macros": "Ккал: 389 ккал / 100 г | Білки: 17 г | Жири: 7 г | Вуглеводи: 66 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Пшоно",
    "imgSrc": "images/proso.jpg",
    "imgAlt": "Пшоно",
    "summary": "119 ккал / 100г. Багате на магній.",
    "ingredients": "",
    "macros": "Ккал: 119 ккал / 100 г | Білки: 3.4 г | Жири: 1 г | Вуглеводи: 22 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Манна крупа",
    "imgSrc": "images/manha.jpg",
    "imgAlt": "Манна крупа",
    "summary": "343 ккал / 100г. Багато клітковини.",
    "ingredients": "",
    "macros": "Ккал: 343 ккал / 100 г | Білки: 25 г | Жири: 1.2 г | Вуглеводи: 61 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Кіноа",
    "imgSrc": "images/kinoa.jpg",
    "imgAlt": "Кіноа",
    "summary": "120 ккал / 100г. Повний білок.",
    "ingredients": "",
    "macros": "Ккал: 120 ккал / 100 г | Білки: 4 г | Жири: 1.9 г | Вуглеводи: 21 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Амарант",
    "imgSrc": "images/amaranth.jpg",
    "imgAlt": "Амарант",
    "summary": "123 ккал / 100г. Безглютенова крупа з лізином.",
    "ingredients": "",
    "macros": "Ккал: 123 ккал / 100 г | Білки: 2.3 г | Жири: 0.4 г | Вуглеводи: 28 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Кукурудзяна крупа",
    "imgSrc": "images/kukurudza.jpg",
    "imgAlt": "Кукурудзяна крупа",
    "summary": "150 ккал / 100г. Традиційна.",
    "ingredients": "",
    "macros": "Ккал: 150 ккал / 100 г | Білки: 3 г | Жири: 0.5 г | Вуглеводи: 31 г"
  },
  {
    "kind": "products",
    "category": "grains",
    "title": "Перловка",
    "imgSrc": "images/perlovka.jpg",
    "imgAlt": "Перловка",
    "summary": "120 ккал / 100г. Низький глікемічний індекс.",
    "ingredients": "",
    "macros": "Ккал: 120 ккал / 100 г | Білки: 2.5 г | Жири: 0.3 г | Вуглеводи: 27 г"
  }
];
// =======================================


// =======================================
//      УНІВЕРСАЛЬНА ФУНКЦІЯ: ПОКАЗ/СКРИТТЯ “ДЕТАЛІВ”
// =======================================
function toggleDetails(button) {
  const details = button.nextElementSibling;
  if (details.style.display === 'none' || details.style.display === '') {
    details.style.display = 'block';
  } else {
    details.style.display = 'none';
  }
}


// =======================================
//     ФУНКЦІЯ ДЛЯ СТВОРЕННЯ ОКРЕМОГО “КАРД-ЕЛЕМЕНТА”
// =======================================
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'recipe-card';
  card.setAttribute('data-category', item.category);

  // Зображення
  const img = document.createElement('img');
  img.src = item.imgSrc;
  img.alt = item.imgAlt;
  card.appendChild(img);

  // Заголовок
  const h3 = document.createElement('h3');
  h3.textContent = item.title;
  card.appendChild(h3);

  // Підзаголовок (summary)
  const pSummary = document.createElement('p');
  pSummary.textContent = item.summary;
  card.appendChild(pSummary);

  // Кнопка “Детальніше”
  const btn = document.createElement('button');
  btn.textContent = 'Детальніше';
  btn.addEventListener('click', () => toggleDetails(btn));
  card.appendChild(btn);

  // Блок з “деталями”
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'card-details';
  detailsDiv.style.display = 'none';

  // Інгредієнти
  if (item.ingredients && item.ingredients.trim() !== '') {
    const pIng = document.createElement('p');
    pIng.innerHTML = `<strong>Інгредієнти:</strong> ${item.ingredients}`;
    detailsDiv.appendChild(pIng);
  }

  // Макроси (або інша додаткова інформація)
  if (item.macros && item.macros.trim() !== '') {
    // Замінюємо “Білки:” → "<strong>Білки:</strong>", “Жири:” → "<strong>Жири:</strong>" тощо
    const macrosHTML = item.macros
      .replace(/Білки:/g, '<strong>Білки:</strong>')
      .replace(/Жири:/g, '<strong>Жири:</strong>')
      .replace(/Вуглеводи:/g, '<strong>Вуглеводи:</strong>')
      .replace(/Ккал:/g, '<strong>Ккал:</strong>');
    const pMac = document.createElement('p');
    pMac.innerHTML = macrosHTML;
    detailsDiv.appendChild(pMac);
  }

  card.appendChild(detailsDiv);
  return card;
}


// =======================================
//       РЕНДЕР РЕЦЕПТІВ ЗА КАТЕГОРІЄЮ
// =======================================
function renderRecipes(selectedCategory) {
  const container = document.getElementById('recipes-grid');
  container.innerHTML = ''; // очищаємо попередній вміст

  // Вибираємо лише ті елементи, що належать до recipes + обрана категорія
  const filtered = dataList.filter(item =>
    item.kind === 'recipes' && item.category === selectedCategory
  );

  filtered.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}


// =======================================
//       РЕНДЕР ПРОДУКТІВ ЗА КАТЕГОРІЄЮ
// =======================================
function renderProducts(selectedCategory) {
  const container = document.getElementById('products-grid');
  container.innerHTML = '';

  // Вибираємо елементи з kind === 'products' + обрана категорія
  const filtered = dataList.filter(item =>
    item.kind === 'products' && item.category === selectedCategory
  );

  filtered.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
  });
}


// =======================================
//    ОБРОБНИКИ ДЛЯ КНОПОК ВИБОРУ КАТЕГОРІЇ
// =======================================
// Ці функції викликаються з HTML:
// <button onclick="filterCategory('soups')">…
function filterCategory(category) {
  renderRecipes(category);
}

// Для продуктів:
function filterProduct(category) {
  renderProducts(category);
}


// =======================================
//    Перемикання вкладок “Рецепти” / “Продукти”
// =======================================
function showMainTab(tabName) {
  const recipesSection = document.getElementById('recipes');
  const productsSection = document.getElementById('products');

  if (tabName === 'recipes') {
    recipesSection.style.display = 'block';
    productsSection.style.display = 'none';
  } else {
    recipesSection.style.display = 'none';
    productsSection.style.display = 'block';
  }

  // Відмічаємо активну кнопку
  document.getElementById('tab-recipes').classList.toggle('active-tab', tabName === 'recipes');
  document.getElementById('tab-products').classList.toggle('active-tab', tabName === 'products');
}


// =======================================
//    ІНІЦІАЛІЗАЦІЯ НА ЗАВАНТАЖЕННІ СТОРІНКИ
// =======================================
document.addEventListener('DOMContentLoaded', () => {
  // За замовчуванням показуємо “Супи” у Рецептах
  renderRecipes('soups');
  // І продукти: перша категорія – 'meat'
  renderProducts('meat');

  // --- Навігація (відмітка ACTIVE LINK) ---
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active-link');
    }
  });
});


// чекаємо, поки DOM (включно з інпутами та canvas) повністю завантажиться
document.addEventListener('DOMContentLoaded', function() {
  // Знайдемо canvas
  const pieCanvas = document.getElementById('pieChart');
  if (!pieCanvas) return; // якщо немає елемента — просто нічого не робимо

  const ctx = pieCanvas.getContext('2d');

  // Зчитаємо значення інпутів (вони вже мають value з PHP/БД)
  const proteinVal = parseInt(document.getElementById('inputProtein').value, 10) || 0;
  const fatVal     = parseInt(document.getElementById('inputFat').value, 10)     || 0;
  const carbVal    = parseInt(document.getElementById('inputCarb').value, 10)    || 0;

  // Для контролю — можна вивести в консоль і перевірити, чи дійсно читаються ті значення, які лежать в інпутах:
  console.log('Сhp read from inputs:', proteinVal, fatVal, carbVal);

  // Створюємо Chart.js (pie)
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Proteins', 'Fats', 'Carbs'],
      datasets: [{
        data: [proteinVal, fatVal, carbVal],
        backgroundColor: [
          '#FF6384', // Proteins
          '#36A2EB', // Fats
          '#FFCE56'  // Carbs
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14,
              family: "'Merriweather', serif"
            }
          }
        }
      }
    }
  });
});
