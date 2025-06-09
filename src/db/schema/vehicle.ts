import { pgTable, text, timestamp, integer, uuid, numeric } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./auth";

export const vehicle = pgTable("vehicle", {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationNumber: text('registration_number'),
  floorSize: integer('floor_size'),
  organizationId: uuid('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  vehicleStatus: integer('vehicle_status'),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  userId: uuid('user_id').references(() => user.id),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});
