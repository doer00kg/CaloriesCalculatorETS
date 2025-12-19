const StatsModel = require('../../src/stats-model');
const { describe, it, expect, beforeEach } = require('vitest');

global.StatsModel = StatsModel;
const { StatsView } = require('../../script');

const buildDom = () => {
  document.body.innerHTML = `
    <div class="gender-tabs">
      <button class="tab-stats active" data-gender="female"></button>
      <button class="tab-stats" data-gender="male"></button>
    </div>
    <input id="year-slider" value="1990" />
    <span id="year-value"></span>
    <input id="height-slider" value="170" />
    <span id="height-value"></span>
    <input id="weight-slider" value="70" />
    <span id="weight-value"></span>
    <select id="activity-select"><option value="light">Light</option></select>
    <div id="activity-desc"></div>
    <input id="fat-slider" value="15" />
    <span id="fat-value"></span>
    <div class="goal-tabs">
      <button class="tab-stats active" data-goal="maintain"></button>
      <button class="tab-stats" data-goal="lose"></button>
    </div>
    <input id="goal-slider" value="70" />
    <span id="goal-value"></span>
    <div class="bmi-dot"></div><div class="bmi-dot"></div><div class="bmi-dot"></div><div class="bmi-dot"></div><div class="bmi-dot"></div><div class="bmi-dot"></div>
    <div id="bmi-value"></div>
    <div id="bmi-status"></div>
    <div id="prots-grams"></div>
    <div id="carbs-grams"></div>
    <div id="fats-grams"></div>
    <div id="fiber-grams"></div>
    <div id="prots-pct"></div>
    <div id="carbs-pct"></div>
    <div id="fats-pct"></div>
    <div id="fiber-pct"></div>
    <div class="info-btn" data-target="info"></div>
    <div id="info"></div>
  `;
};

describe('StatsView integration', () => {
  beforeEach(() => {
    buildDom();
  });

  it('syncs labels and renders macros with StatsModel', () => {
    const view = new StatsView();
    const model = new StatsModel({
      gender: 'female',
      year: 1990,
      height: 165,
      weight: 62,
      age: 34,
      activity: 'light',
      goal: 'maintain',
    });

    view.syncLabels();
    const macros = model.calcMacros();
    const bmi = model.calcBMI();
    const status = model.getBmiStatus();
    view.render({ bmi, bmiStatus: status, macros });

    expect(document.getElementById('height-value').textContent).toBe('165');
    expect(document.getElementById('bmi-value').textContent).not.toBe('');
    expect(document.getElementById('prots-grams').textContent).toBe(String(macros.prots));
    expect(document.querySelectorAll('.bmi-dot.active').length).toBe(1);
  });
});