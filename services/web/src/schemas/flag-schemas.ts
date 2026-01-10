import { z } from 'zod';

export const createFlagSchema = z
  .object({
    projectId: z.string().min(1, 'Project is required'),
    name: z.string().min(1, 'Flag name is required').max(200),
    key: z.string().min(1, 'Flag key is required'),
    description: z.string().optional(),
    valueType: z.enum(['boolean', 'string', 'number', 'json']),
    defaultValue: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.valueType === 'boolean' && !['true', 'false'].includes(data.defaultValue)) {
      ctx.addIssue({
        code: 'custom',
        message: "Boolean value must be 'true' or 'false'",
        path: ['defaultValue'],
      });
    }
    if (data.valueType === 'number' && isNaN(Number(data.defaultValue))) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid number format',
        path: ['defaultValue'],
      });
    }
    if (data.valueType === 'json') {
      try {
        JSON.parse(data.defaultValue);
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid JSON format',
          path: ['defaultValue'],
        });
      }
    }
  });

export type CreateFlagInput = z.infer<typeof createFlagSchema>;
