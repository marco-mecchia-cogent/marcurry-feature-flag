import { getDb } from '../db';
import type { Gate } from '../db/types';

const adapter = getDb();

export async function listProducts() {
  return adapter.listProducts();
}

export async function createProduct(data: { name?: unknown; description?: unknown } | unknown) {
  const d = (data as { name?: unknown; description?: unknown }) ?? {};
  if (!d?.name) throw new Error('name is required');
  return adapter.createProduct({
    name: String(d.name),
    description: typeof d.description === 'undefined' ? undefined : String(d.description),
  });
}

export async function getProductById(id: string) {
  return adapter.getProduct(id);
}

export async function updateProductById(id: string, body: { name?: unknown; description?: unknown } | unknown) {
  const b = (body as { name?: unknown; description?: unknown }) ?? {};
  return adapter.updateProduct(id, {
    name: typeof b.name === 'undefined' ? undefined : String(b.name),
    description: typeof b.description === 'undefined' ? undefined : String(b.description),
  });
}

export async function deleteProductById(id: string) {
  return adapter.deleteProduct(id);
}

// Flags
export async function listFeatureFlags(query: { productId?: string; envId?: string }) {
  return adapter.listFeatureFlags(query.productId, query.envId);
}

export async function createFeatureFlag(body: unknown) {
  const b = (body as Record<string, unknown>) ?? {};
  const { productId, envId, id, label, enabled, description, gates } = b;
  if (!productId || !envId || !label || typeof enabled === 'undefined')
    throw new Error('productId, envId, label and enabled are required');
  if (typeof enabled !== 'boolean') throw new Error('enabled must be boolean');

  return adapter.createFeatureFlag({
    id: typeof id === 'undefined' ? undefined : String(id),
    productId: String(productId),
    envId: String(envId),
    label: String(label),
    enabled: Boolean(enabled),
    description: typeof description === 'undefined' ? undefined : String(description),
    gates: Array.isArray(gates) ? (gates as unknown as Gate[]) : [],
  });
}

export async function getFeatureFlagById(id: string) {
  return adapter.getFeatureFlag(id);
}

export async function updateFeatureFlagById(id: string, body: unknown) {
  const b = (body as Record<string, unknown>) ?? {};
  return adapter.updateFeatureFlag(id, {
    description: typeof b.description === 'undefined' ? undefined : String(b.description),
    gates: typeof b.gates === 'undefined' ? undefined : (b.gates as unknown as Gate[]),
    label: typeof b.label === 'undefined' ? undefined : String(b.label),
    enabled: typeof b.enabled === 'undefined' ? undefined : Boolean(b.enabled),
  });
}

export async function deleteFeatureFlagById(id: string) {
  return adapter.deleteFeatureFlag(id);
}

// Environments
export async function listEnvironments(query: { productId?: string }) {
  return adapter.listEnvironments(query.productId);
}

export async function createEnvironment(body: unknown) {
  const b = (body as Record<string, unknown>) ?? {};
  if (!b?.productId || !b?.name) throw new Error('productId and name are required');
  return adapter.createEnvironment({
    productId: String(b.productId),
    name: String(b.name),
    description: typeof b.description === 'undefined' ? undefined : String(b.description),
  });
}

export async function getEnvironmentById(id: string) {
  return adapter.getEnvironment(id);
}

export async function updateEnvironmentById(id: string, body: { name?: unknown; description?: unknown } | unknown) {
  const b = (body as { name?: unknown; description?: unknown }) ?? {};
  return adapter.updateEnvironment(id, {
    name: typeof b.name === 'undefined' ? undefined : String(b.name),
    description: typeof b.description === 'undefined' ? undefined : String(b.description),
  });
}

export async function deleteEnvironmentById(id: string) {
  return adapter.deleteEnvironment(id);
}

// Enabled Flags
export async function listEnabledFlags(query: { productId: string; envId: string; actorId: string }) {
  return adapter.getEnabledFlagsForActor(query.productId, query.envId, query.actorId);
}
