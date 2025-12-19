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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatsModel;
}

if (typeof window !== 'undefined') {
  window.StatsModel = StatsModel;
}