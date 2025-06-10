import { pgTable, timestamp, integer, uuid, text } from "drizzle-orm/pg-core";

export const job = pgTable("job", {
  id: uuid('id').defaultRandom().primaryKey(),
  fromLocationId: uuid('from_location_id').notNull(),
  toLocationId: uuid('to_location_id').notNull(),
  organizationId: uuid('organization_id').notNull(),
  dueDate: timestamp('due_date'),
  status: text('job_status', { enum: ['active', 'inactive', 'closed', 'cancelled'] }).default('active').notNull(),
  transporterId: uuid('transporter_id'),
  vehicleId: uuid('vehicle_id'),
  publishedAt: timestamp('published_at'),
  acceptedAt: timestamp('accepted_at'),
  deliveredAt: timestamp('delivered_at'),
  publishedToAcceptanceTime: integer('published_to_acceptance_time'),
  acceptanceToDeliveryTime: integer('acceptance_to_delivery_time'),
  publishedToDeliveryTime: integer('published_to_delivery_time'),
  loadType: integer('load_type').default(0),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});


export const jobConsignment = pgTable("job_consignment", {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull(),
  containerIdentifier: text('container_identifier').notNull(),
  containerType: text('container_type', { enum: ['20ft', '40ft'] }).notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status', { enum: ['bidding', 'bidding_accepted', 'bidding_rejected', 'bidding_withdrawn', 'bidding_expired', 'bidding_cancelled', 'bidding_completed'] }).default('bidding').notNull(),
  vehicleId: uuid('vehicle_id'),
  price: integer('price'),
  transporterId: uuid('transporter_id'),
  bidLineItemId: uuid('bid_line_item_id'),
  bidId: uuid('bid_id'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});

export type JobConsignment = typeof jobConsignment.$inferSelect;
export type JobConsignmentCreate = typeof jobConsignment.$inferInsert & {
  jobId: string;
  containerIdentifier: string;
  containerType: '20ft' | '40ft';
};

export const jobBid = pgTable("job_bid", {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').notNull(),
  transporterId: uuid('transporter_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'rejected', 'withdrawn'] }).default('pending').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});


export const jobBidLineItem = pgTable("job_bid_line_item", {
  id: uuid('id').defaultRandom().primaryKey(),
  jobBidId: uuid('job_bid_id').notNull(),
  jobId: uuid('job_id').notNull(),
  jobConsignmentId: uuid('job_consignment_id'),
  vehicleId: uuid('vehicle_id').notNull(),
  transporterId: uuid('transporter_id').notNull(),
  price: integer('price'),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull()
});




export type Job = typeof job.$inferSelect;
export type JobCreate = Omit<typeof job.$inferInsert, "userId" | "organizationId"> & {
  fromLocationId: string;
  toLocationId: string;
  consignments: Pick<JobConsignmentCreate, 'containerIdentifier' | 'containerType'>[];
};