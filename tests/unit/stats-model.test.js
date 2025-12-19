const StatsModel = require('../../src/stats-model');
const { describe, it, expect } = require('vitest');

describe('StatsModel', () => {
  it('calculates BMI with centimeters to meters conversion', () => {
    const model = new StatsModel({ weight: 80, height: 180, age: 30, gender: 'male', activity: 'moderate', goal: 'maintain' });
    expect(model.calcBMI()).toBeCloseTo(24.69, 2);
  });

  it('returns BMI status buckets', () => {
    const under = new StatsModel({ weight: 50, height: 180, age: 25, gender: 'female', activity: 'light', goal: 'maintain' });
    expect(under.getBmiStatus()).toEqual({ idx: 0, label: 'Недостатня вага' });

    const normal = new StatsModel({ weight: 70, height: 175, age: 25, gender: 'female', activity: 'light', goal: 'maintain' });
    expect(normal.getBmiStatus()).toEqual({ idx: 1, label: 'Норма' });

    const obese = new StatsModel({ weight: 120, height: 170, age: 40, gender: 'male', activity: 'moderate', goal: 'maintain' });
    expect(obese.getBmiStatus()).toEqual({ idx: 4, label: 'Ожиріння II' });
  });

  it('uses gender aware BMR calculation', () => {
    const female = new StatsModel({ weight: 60, height: 165, age: 28, gender: 'female', activity: 'sedentary', goal: 'maintain' });
    const male = new StatsModel({ weight: 60, height: 165, age: 28, gender: 'male', activity: 'sedentary', goal: 'maintain' });

    expect(female.calcBMR()).toBeCloseTo(1334.25, 2);
    expect(male.calcBMR()).toBeCloseTo(1500.25, 2);
  });

  it('calculates target calories for every goal', () => {
    const base = { weight: 70, height: 175, age: 30, gender: 'male', activity: 'light' };
    const lose = new StatsModel({ ...base, goal: 'lose' });
    const gain = new StatsModel({ ...base, goal: 'gain' });
    const maintain = new StatsModel({ ...base, goal: 'maintain' });

    expect(lose.calcTargetCalories()).toBeLessThan(maintain.calcTargetCalories());
    expect(gain.calcTargetCalories()).toBeGreaterThan(maintain.calcTargetCalories());
  });

  it('derives macros from target calories', () => {
    const model = new StatsModel({ weight: 90, height: 185, age: 35, gender: 'male', activity: 'heavy', goal: 'gain' });
    expect(model.calcMacros()).toEqual({
      prots: 246,
      carbs: 410,
      fats: 54,
      fiber: 25,
    });
  });
});