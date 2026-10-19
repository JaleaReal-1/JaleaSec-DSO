import { Preferences } from '@capacitor/preferences';
import { emptyPlanner, validatePlanner } from '../../../../../packages/core/planner.js';
export const plannerStorageKey = 'jaleasec.campusplanner.v1';

export class LocalPlannerRepository {
  constructor(preferences = Preferences) {
    this.preferences = preferences;
  }
  async load() {
    const { value } = await this.preferences.get({ key: plannerStorageKey });
    if (value !== null) return validatePlanner(JSON.parse(value));

    // Recognize an earlier brand namespace by the stable application/version suffix.
    // Never choose between multiple backups or erase the source during migration.
    const { keys } = await this.preferences.keys();
    const candidates = keys.filter(
      (key) => key !== plannerStorageKey && key.endsWith('.campusplanner.v1'),
    );
    if (candidates.length > 1)
      throw new Error('Hay varias copias anteriores; restaura una copia JSON.');
    if (candidates.length === 0) return emptyPlanner();
    const previous = await this.preferences.get({ key: candidates[0] });
    if (previous.value === null) return emptyPlanner();
    const state = validatePlanner(JSON.parse(previous.value));
    await this.save(state);
    return state;
  }
  async save(state) {
    await this.preferences.set({
      key: plannerStorageKey,
      value: JSON.stringify(validatePlanner(state)),
    });
  }
}
