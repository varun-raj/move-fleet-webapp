import { pgTable, text, timestamp, integer, uuid, numeric } from "drizzle-orm/pg-core";

export const location = pgTable("location", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  address: text('address'),
  createdBy: uuid('created_by'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  organizationId: uuid('organization_id'),
  privacy: integer('privacy'),
  locationType: integer('location_type').default(0),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});
