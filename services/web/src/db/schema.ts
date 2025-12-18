import { relations } from 'drizzle-orm';
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

export const apiKeys = pgTable(
  'api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id')
      .references(() => projects.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    keyPrefix: text('key_prefix').notNull(),
    secretKeyHash: text('secret_key_hash').notNull(),
    allowedEnvironmentIds: jsonb('allowed_environment_ids').notNull().default('[]'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at'),
  },
  (table) => [
    index('api_keys_project_id_idx').on(table.projectId),
    index('api_keys_key_prefix_idx').on(table.keyPrefix),
  ]
);

export type ProjectRow = typeof projects.$inferSelect;
export type EnvironmentRow = typeof environments.$inferSelect;
export type FlagRow = typeof flags.$inferSelect;
export type FlagEnvironmentConfigRow = typeof flagEnvironmentConfigs.$inferSelect;
export type ApiKeyRow = typeof apiKeys.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type InsertEnvironment = typeof environments.$inferInsert;
export type InsertFlag = typeof flags.$inferInsert;
export type InsertFlagEnvironmentConfig = typeof flagEnvironmentConfigs.$inferInsert;
export type InsertApiKey = typeof apiKeys.$inferInsert;

/** Better Auth */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

/**
 * Specific Auth-related schema for Better Auth consumption.
 * While we don't have to specify it and the better-auth drizzle adapter works without it,
 * it's better to be explicit about the schema structure.
 */
export const authSchema = { user, session, account, verification };

/** Better Auth End */
