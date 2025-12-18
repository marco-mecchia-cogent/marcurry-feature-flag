'use server';

import { FlagService } from '@/lib/services/flag-service';
import { revalidatePath } from 'next/cache';
import type {
  Flag,
  FlagEnvironmentConfig,
  FlagValueType,
  FlagValueTypeMap,
  Gate,
  Actor,
  EvaluationResult,
} from '@marcurry/core';

// ============================================================================
// Flag CRUD
// ============================================================================

export async function listFlagsAction(projectId: string): Promise<Flag[]> {
  const flagService = new FlagService();
  return flagService.listFlags(projectId);
}

export async function getFlagAction(id: string): Promise<Flag> {
  const flagService = new FlagService();
  return flagService.getFlag(id);
}

export async function getFlagByKeyAction(projectId: string, key: string): Promise<Flag> {
  const flagService = new FlagService();
  return flagService.getFlagByKey(projectId, key);
}

export async function createFlagAction(data: {
  projectId: string;
  key: string;
  name: string;
  valueType: FlagValueType;
  defaultValue: FlagValueTypeMap[FlagValueType];
}): Promise<Flag> {
  const flagService = new FlagService();
  const flag = await flagService.createFlag(data);
  revalidatePath(`/projects/${data.projectId}`);
  revalidatePath(`/projects/${data.projectId}/flags`);
  return flag;
}

export async function updateFlagAction(
  id: string,
  projectId: string,
  data: {
    name?: string;
    defaultValue?: FlagValueTypeMap[FlagValueType];
  }
): Promise<Flag> {
  const flagService = new FlagService();
  const flag = await flagService.updateFlag(id, data);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/flags`);
  revalidatePath(`/projects/${projectId}/flags/${id}`);
  return flag;
}

export async function deleteFlagAction(id: string, projectId: string): Promise<void> {
  const flagService = new FlagService();
  await flagService.deleteFlag(id);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/flags`);
}

// ============================================================================
// Flag Environment Config CRUD
// ============================================================================

export async function listFlagConfigsAction(flagId: string): Promise<FlagEnvironmentConfig[]> {
  const flagService = new FlagService();
  return flagService.listFlagConfigs(flagId);
}

export async function getFlagConfigAction(flagId: string, environmentId: string): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();
  return flagService.getFlagConfig(flagId, environmentId);
}

export async function getFlagConfigByKeysAction(
  projectId: string,
  environmentKey: string,
  flagKey: string
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();
  return flagService.getFlagConfigByKeys(projectId, environmentKey, flagKey);
}

export async function createFlagConfigAction(data: {
  flagId: string;
  environmentId: string;
  projectId: string;
  enabled: boolean;
  defaultValue: FlagValueTypeMap[FlagValueType];
  gates?: Gate[];
}): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();
  const config = await flagService.createFlagConfig({
    flagId: data.flagId,
    environmentId: data.environmentId,
    enabled: data.enabled,
    defaultValue: data.defaultValue,
    gates: data.gates,
  });
  revalidatePath(`/projects/${data.projectId}/flags/${data.flagId}`);
  return config;
}

export async function updateFlagConfigAction(
  configId: string,
  projectId: string,
  flagId: string,
  data: {
    enabled?: boolean;
    defaultValue?: FlagValueTypeMap[FlagValueType];
    gates?: Gate[];
  }
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();
  const config = await flagService.updateFlagConfig(configId, data);
  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
  return config;
}

export async function deleteFlagConfigAction(configId: string, projectId: string, flagId: string): Promise<void> {
  const flagService = new FlagService();
  await flagService.deleteFlagConfig(configId);
  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
}

// ============================================================================
// Gate Management
// ============================================================================

export async function addGateAction(
  configId: string,
  projectId: string,
  flagId: string,
  gate: Omit<Gate, 'id'>
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();

  const config = await flagService.getFlagConfig(
    flagId,
    (await flagService.listFlagConfigs(flagId)).find((c) => c.id === configId)!.environmentId
  );

  const newGate: Gate = {
    ...gate,
    id: crypto.randomUUID(),
  } as Gate;

  const updatedConfig = await flagService.updateFlagConfig(configId, {
    gates: [...config.gates, newGate] as Gate[],
  });

  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
  return updatedConfig;
}

export async function updateGateAction(
  configId: string,
  projectId: string,
  flagId: string,
  gateId: string,
  updates: Partial<Omit<Gate, 'id'>>
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();

  const config = await flagService.getFlagConfig(
    flagId,
    (await flagService.listFlagConfigs(flagId)).find((c) => c.id === configId)!.environmentId
  );

  const updatedGates: Gate[] = config.gates.map((gate) =>
    gate.id === gateId ? ({ ...gate, ...updates } as Gate) : gate
  );

  const updatedConfig = await flagService.updateFlagConfig(configId, {
    gates: updatedGates,
  });

  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
  return updatedConfig;
}

export async function deleteGateAction(
  configId: string,
  projectId: string,
  flagId: string,
  gateId: string
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();

  const config = await flagService.getFlagConfig(
    flagId,
    (await flagService.listFlagConfigs(flagId)).find((c) => c.id === configId)!.environmentId
  );

  const updatedGates: Gate[] = config.gates.filter((gate) => gate.id !== gateId);

  const updatedConfig = await flagService.updateFlagConfig(configId, {
    gates: updatedGates,
  });

  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
  return updatedConfig;
}

export async function reorderGatesAction(
  configId: string,
  projectId: string,
  flagId: string,
  gateIds: string[]
): Promise<FlagEnvironmentConfig> {
  const flagService = new FlagService();

  const config = await flagService.getFlagConfig(
    flagId,
    (await flagService.listFlagConfigs(flagId)).find((c) => c.id === configId)!.environmentId
  );

  const gateMap = new Map(config.gates.map((g) => [g.id, g]));
  const reorderedGates: Gate[] = gateIds.map((id) => gateMap.get(id)!).filter(Boolean);

  const updatedConfig = await flagService.updateFlagConfig(configId, {
    gates: reorderedGates,
  });

  revalidatePath(`/projects/${projectId}/flags/${flagId}`);
  return updatedConfig;
}

// ============================================================================
// Evaluation
// ============================================================================

export async function evaluateFlagAction(
  projectId: string,
  environmentKey: string,
  flagKey: string,
  actor: Actor
): Promise<EvaluationResult> {
  const flagService = new FlagService();
  return flagService.evaluateFlag(projectId, environmentKey, flagKey, actor);
}
