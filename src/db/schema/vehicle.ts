import { pgTable, text, timestamp, uuid, point } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./auth";

export const vehicle = pgTable("vehicle", {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationNumber: text('registration_number'),
  floorSize: text('floor_size', { enum: ['20ft', '40ft'] }),
  organizationId: uuid('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['active', 'in_job', 'inactive', 'maintenance', 'out_of_service'] }).default('active').notNull(),
  locationCoordinates: point('location_coordinates'),
  userId: uuid('user_id').references(() => user.id),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

export type Vehicle = typeof vehicle.$inferSelect;
export type VehicleCreate = Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "organizationId" | "userId" | "locationCoordinates">;
