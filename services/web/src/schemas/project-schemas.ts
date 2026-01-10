import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(200),
  key: z.string().min(1, 'Project key is required'),
  environments: z
    .array(
      z.object({
        name: z.string().min(1, 'Environment name is required'),
        key: z.string().min(1, 'Environment key is required'),
      })
    )
    .min(1, 'At least one environment is required')
    .refine(
      (envs) => new Set(envs.map((e) => e.name.toLowerCase())).size === envs.length,
      'Environment names must be unique'
    )
    .refine(
      (envs) => new Set(envs.map((e) => e.key.toLowerCase())).size === envs.length,
      'Environment keys must be unique'
    ),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
