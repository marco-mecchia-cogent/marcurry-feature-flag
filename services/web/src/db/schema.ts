import { pgTable, uuid, text, boolean, jsonb, timestamp, unique, index } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const environments = pgTable(
  'environments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    key: text('key').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('environments_project_key_unique').on(table.projectId, table.key),
    index('environments_project_id_idx').on(table.projectId),
  ]
);

export const flags = pgTable(
  'flags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    key: text('key').notNull(),
    name: text('name').notNull(),
    valueType: text('value_type').notNull(),
    defaultValue: jsonb('default_value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('flags_project_key_unique').on(table.projectId, table.key),
    index('flags_project_id_idx').on(table.projectId),
  ]
);

export const flagEnvironmentConfigs = pgTable(
  'flag_environment_configs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    flagId: uuid('flag_id')
      .references(() => flags.id, { onDelete: 'cascade' })
      .notNull(),
    environmentId: uuid('environment_id')
      .references(() => environments.id, { onDelete: 'cascade' })
      .notNull(),
    enabled: boolean('enabled').notNull().default(true),
    defaultValue: jsonb('default_value').notNull(),
    gates: jsonb('gates').notNull().default('[]'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    unique('flag_environment_configs_flag_env_unique').on(table.flagId, table.environmentId),
    index('flag_environment_configs_flag_id_idx').on(table.flagId),
    index('flag_environment_configs_environment_id_idx').on(table.environmentId),
  ]
);

export type ProjectRow = typeof projects.$inferSelect;
export type EnvironmentRow = typeof environments.$inferSelect;
export type FlagRow = typeof flags.$inferSelect;
export type FlagEnvironmentConfigRow = typeof flagEnvironmentConfigs.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type InsertEnvironment = typeof environments.$inferInsert;
export type InsertFlag = typeof flags.$inferInsert;
export type InsertFlagEnvironmentConfig = typeof flagEnvironmentConfigs.$inferInsert;
