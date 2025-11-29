import type { Gate, Actor } from '../types/value-objects.js';

/**
 * Checks if an actor matches a gate's criteria.
 */
export function matchesGate<T>(gate: Gate<T>, actor: Actor): boolean {
  if (!gate.enabled) {
    return false;
  }

  switch (gate.type) {
    case 'boolean':
      return true;
    case 'actors':
      return gate.actorIds.includes(actor.id);
  }
}
