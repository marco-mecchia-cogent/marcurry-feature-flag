import type { ActorId, GateId } from './identifiers.js';

/** Anything that gates are evaluated against. */
export type Actor = {
  id: ActorId;
  attributes?: Record<string, string | number | boolean | string[]>;
};

/** Determine how actors are targeted. */
export type GateType = 'boolean' | 'actors';

/** Base properties shared by all gate types. */
type BaseGate = {
  id: GateId;
  enabled: boolean;
};

/** Returns the same value for all actors. */
export type BooleanGate<T> = BaseGate & {
  type: 'boolean';
  value: T;
};

/** Returns a value only for specific actor IDs. */
export type ActorsGate<T> = BaseGate & {
  type: 'actors';
  actorIds: ActorId[];
  value: T;
};

/** A gate evaluates an actor and returns a value if matched. */
export type Gate<T = boolean | string | number | object> = BooleanGate<T> | ActorsGate<T>;
