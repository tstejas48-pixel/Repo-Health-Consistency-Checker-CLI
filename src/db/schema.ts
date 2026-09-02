import { pgTable, text, timestamp, integer, jsonb, uuid, boolean } from 'drizzle-orm/pg-core';

export const repositories = pgTable('repositories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url'),
  type: text('type').notNull(), // 'github', 'local', 'upload'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  healthScore: integer('health_score').notNull(),
  status: text('status').notNull(), // 'running', 'completed', 'failed'
  config: jsonb('config'),
  results: jsonb('results'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const checks = pgTable('checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  analysisId: uuid('analysis_id').references(() => analyses.id).notNull(),
  checkType: text('check_type').notNull(),
  severity: text('severity').notNull(), // 'error', 'warning', 'info', 'success'
  passed: boolean('passed').notNull(),
  message: text('message').notNull(),
  details: jsonb('details'),
  filePath: text('file_path'),
  lineNumber: integer('line_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
