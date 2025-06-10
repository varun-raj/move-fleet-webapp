import { pgTable, text, timestamp, boolean, uuid, point } from "drizzle-orm/pg-core";
import { createSelectSchema, createUpdateSchema } from "drizzle-zod";

export const location = pgTable("location", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  address: text('address'),
  userId: uuid('user_id'),
  locationCoordinates: point('location_coordinates'),
  organizationId: uuid('organization_id'),
  privacy: boolean('privacy'),
  locationType: text('location_type', { enum: ['yard', 'warehouse'] }).default('yard'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});


export const locationUpdateSchema = createUpdateSchema(location);

export const locationSelectSchema = createSelectSchema(location);


export type Location = typeof location.$inferSelect;
