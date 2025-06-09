import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const organization = pgTable("organization", {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  organizationType: text('organization_type', { enum: ["clearing_agency", "transporter", "delivery_agency"] }).default('clearing_agency').notNull()
});

export const organizationCreateSchema = createInsertSchema(organization);


export const organizationUpdateSchema = createUpdateSchema(organization);

export const organizationSelectSchema = createSelectSchema(organization);


export type Organization = typeof organization.$inferSelect;
export type OrganizationCreate = typeof organization.$inferInsert;

export const member = pgTable("member", {
  id: uuid('id').primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').default('member').notNull(),
  createdAt: timestamp('created_at').notNull()
});

export type Member = typeof member.$inferSelect;
export type MemberCreate = typeof member.$inferInsert;

export const invitation = pgTable("invitation", {
  id: uuid('id').primaryKey(),
  organizationId: uuid('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  status: text('status').default('pending').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: uuid('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const partnership = pgTable("partnership", {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceOrganizationId: uuid('source_organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  targetOrganizationId: uuid('target_organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});
