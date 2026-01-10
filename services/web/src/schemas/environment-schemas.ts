import { z } from 'zod';

export const createEnvironmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  key: z.string().min(1, 'Key is required'),
});

export const updateEnvironmentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  key: z.string().min(1, 'Key is required'),
});

export type CreateEnvironmentInput = z.infer<typeof createEnvironmentSchema>;
export type UpdateEnvironmentInput = z.infer<typeof updateEnvironmentSchema>;
