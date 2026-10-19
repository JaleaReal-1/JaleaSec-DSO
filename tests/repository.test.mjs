import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LocalPlannerRepository,
  plannerStorageKey,
} from '../apps/mobile/campus-planner/src/data/repository.js';
import { emptyPlanner } from '../packages/core/planner.js';

function memoryPreferences(values = {}, failWrite = false) {
  const data = new Map(Object.entries(values));
  return {
    data,
    async get({ key }) {
      return { value: data.get(key) ?? null };
    },
    async keys() {
      return { keys: [...data.keys()] };
    },
    async set({ key, value }) {
      if (failWrite) throw new Error('Storage unavailable');
      data.set(key, value);
    },
  };
}
const previousKey = 'previous-brand.campusplanner.v1';
test('repository migrates a validated prior namespace without deleting its source', async () => {
  const state = emptyPlanner();
  state.settings.name = 'Mi semestre';
  const original = JSON.stringify(state);
  const prefs = memoryPreferences({ [previousKey]: original, unrelated: 'keep' });
  assert.deepEqual(await new LocalPlannerRepository(prefs).load(), state);
  assert.equal(prefs.data.get(plannerStorageKey), original);
  assert.equal(prefs.data.get(previousKey), original);
  assert.equal(prefs.data.get('unrelated'), 'keep');
});
test('current namespace wins; a fresh install starts empty', async () => {
  const state = emptyPlanner();
  state.settings.name = 'Actual';
  const prefs = memoryPreferences({
    [plannerStorageKey]: JSON.stringify(state),
    [previousKey]: 'invalid',
  });
  assert.deepEqual(await new LocalPlannerRepository(prefs).load(), state);
  assert.deepEqual(await new LocalPlannerRepository(memoryPreferences()).load(), emptyPlanner());
});
test('invalid or ambiguous previous data cannot overwrite the current namespace', async () => {
  for (const values of [
    { [previousKey]: '{bad' },
    { [previousKey]: JSON.stringify({ version: 999 }) },
    { [previousKey]: '{}', 'other.campusplanner.v1': '{}' },
  ]) {
    const prefs = memoryPreferences(values);
    await assert.rejects(new LocalPlannerRepository(prefs).load());
    assert.equal(prefs.data.has(plannerStorageKey), false);
    assert.deepEqual(Object.fromEntries(prefs.data), values);
  }
});
test('a failed migration write reports failure and keeps the original data', async () => {
  const original = JSON.stringify(emptyPlanner());
  const prefs = memoryPreferences({ [previousKey]: original }, true);
  await assert.rejects(new LocalPlannerRepository(prefs).load(), /Storage unavailable/);
  assert.equal(prefs.data.get(previousKey), original);
  assert.equal(prefs.data.has(plannerStorageKey), false);
});
