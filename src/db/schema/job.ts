import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const job = pgTable("job", {
  id: uuid('id').defaultRandom().primaryKey(),
  containerName: text('container_name'),
  fromLocationId: uuid('from_location_id').notNull(),
  toLocationId: uuid('to_location_id').notNull(),
  organizationId: uuid('organization_id').notNull(),
  dueDate: timestamp('due_date'),
  jobStatus: integer('job_status'),
  transporterId: uuid('transporter_id'),
  vehicleId: uuid('vehicle_id'),
  publishedAt: timestamp('published_at'),
  acceptedAt: timestamp('accepted_at'),
  deliveredAt: timestamp('delivered_at'),
  publishedToAcceptanceTime: integer('published_to_acceptance_time'),
  acceptanceToDeliveryTime: integer('acceptance_to_delivery_time'),
  publishedToDeliveryTime: integer('published_to_delivery_time'),
  loadType: integer('load_type').default(0),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

export const jobRequest = pgTable("job_request", {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull().references(() => job.id),
  transporterId: uuid('transporter_id').notNull(),
  userId: uuid('user_id').notNull().references(() => user.id),
  jobRequestStatus: integer('job_request_status').notNull(),
  vehicleId: uuid('vehicle_id'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});
