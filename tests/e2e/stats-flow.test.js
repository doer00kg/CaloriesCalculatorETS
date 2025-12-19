const StatsModel = require('../../src/stats-model');
const { describe, it, expect } = require('vitest');

global.StatsModel = StatsModel;
const { initStatsController, applyLoadedData } = require('../../script');

const buildDom = () => {
  document.body.innerHTML = `
    <input type="hidden" id="inputSex" />
    <input type="hidden" id="inputGoal" />
    <div class="gender-tabs">
      <button class="tab-stats" data-gender="female"></button>
      <button class="tab-stats" data-gender="male"></button>
    </div>
    <input id="year-slider" value="1990" />
    <span id="year-value"></span>
    <input id="height-slider" value="170" />
    <span id="height-value"></span>
    <input id="weight-slider" value="70" />
    <span id="weight-value"></span>
    <select id="activity-select">
      <option value="light">Light</option>
      <option value="heavy">Heavy</option>
    </select>
    <div id="activity-desc"></div>
    <input id="fat-slider" value="15" />
    <span id="fat-value"></span>
    <div class="goal-tabs">
      <button class="tab-stats" data-goal="lose"></button>
      <button class="tab-stats" data-goal="maintain"></button>
      <button class="tab-stats" data-goal="gain"></button>
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

describe('Stats E2E flow', () => {
  it('prefills data, runs controller, and reacts to user edits', () => {
    buildDom();
    applyLoadedData({
      sex: 'M',
      goal: 2,
      age: 1995,
      height: 182,
      weight: 88,
      fats: 20,
      goal_weight: 85,
      activity_level: 'heavy',
    });

    const { view } = initStatsController();

    const weightSlider = document.getElementById('weight-slider');
    weightSlider.value = '95';
    weightSlider.dispatchEvent(new Event('input', { bubbles: true }));

    expect(document.getElementById('inputSex').value).toBe('male');
    expect(document.getElementById('activity-desc').textContent).not.toBe('');
    expect(document.getElementById('bmi-value').textContent).not.toBe('');
    expect(document.getElementById('prots-grams').textContent).not.toBe('');

    const activeDots = document.querySelectorAll('.bmi-dot.active');
    expect(activeDots.length).toBe(1);
    expect(view.getInputs().weight).toBe(95);
  });
});