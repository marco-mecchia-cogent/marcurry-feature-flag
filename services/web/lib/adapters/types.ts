export type ID = string;

export interface Product {
  id: ID;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Environment {
  id: ID;
  productId: ID;
  name: string;
  description?: string;
  createdAt: string;
}

export type Gate = GateAll | GateUsers | GateGroups;

export interface GateAll {
  type: 'all';
  enabled: boolean;
}

export interface GateUsers {
  type: 'users';
  actorIds: string[];
}

export interface GateGroups {
  type: 'groups';
  groupIds: string[];
}

export interface FeatureFlag {
  id: ID;
  productId: ID;
  envId: ID;
  key: string;
  description?: string;
  gates: Gate[];
  createdAt: string;
}
