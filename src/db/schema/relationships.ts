import { relations } from "drizzle-orm";
import { user } from "./auth";
import { organization, member, invitation, partnership } from "./organization";
import { vehicle } from "./vehicle";
import { job, jobBid, jobBidLineItem, jobConsignment, } from "./job";
import { location } from "./location";

// User relationships
export const userRelations = relations(user, ({ many }) => ({
  members: many(member),
  invitationsSent: many(invitation, { relationName: "inviter" }),
  vehicles: many(vehicle),
  jobs: many(job)
}));

// Organization relationships
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invitations: many(invitation),
  sourcePartnerships: many(partnership, { relationName: "sourceOrganization" }),
  targetPartnerships: many(partnership, { relationName: "targetOrganization" }),
  vehicles: many(vehicle),
  partners: many(partnership, { relationName: "sourceOrganization" }),
  partnerOf: many(partnership, { relationName: "targetOrganization" })
}));

export const memberRelations = relations(member, ({ one }) => ({
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id]
  })
}));

// Vehicle relationships
export const vehicleRelations = relations(vehicle, ({ one, many }) => ({
  organization: one(organization, {
    fields: [vehicle.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [vehicle.userId],
    references: [user.id]
  }),
  jobConsignments: many(jobConsignment)
}));

// Job relationships
export const jobRelations = relations(job, ({ many, one }) => ({
  bids: many(jobBid),
  jobBidLineItems: many(jobBidLineItem),
  jobConsignments: many(jobConsignment),
  user: one(user, {
    fields: [job.userId],
    references: [user.id]
  }),
  organization: one(organization, {
    fields: [job.organizationId],
    references: [organization.id]
  }),
  fromLocation: one(location, {
    fields: [job.fromLocationId],
    references: [location.id]
  }),
  toLocation: one(location, {
    fields: [job.toLocationId],
    references: [location.id]
  })
}));

export const jobConsignmentRelations = relations(jobConsignment, ({ one }) => ({
  job: one(job, {
    fields: [jobConsignment.jobId],
    references: [job.id]
  }),
  user: one(user, {
    fields: [jobConsignment.userId],
    references: [user.id]
  }),
  vehicle: one(vehicle, {
    fields: [jobConsignment.vehicleId],
    references: [vehicle.id]
  }),
  transporter: one(user, {
    fields: [jobConsignment.transporterId],
    references: [user.id]
  }),
  bidLineItem: one(jobBidLineItem, {
    fields: [jobConsignment.bidLineItemId],
    references: [jobBidLineItem.id]
  }),
  bid: one(jobBid, {
    fields: [jobConsignment.bidId],
    references: [jobBid.id]
  })
}));

// JobRequest relationships
export const jobBidRelations = relations(jobBid, ({ one, many, }) => ({
  job: one(job, {
    fields: [jobBid.jobId],
    references: [job.id]
  }),
  user: one(user, {
    fields: [jobBid.userId],
    references: [user.id]
  }),
  bidLineItems: many(jobBidLineItem)
}));


export const jobBidLineItemRelations = relations(jobBidLineItem, ({ one }) => ({
  jobBid: one(jobBid, {
    fields: [jobBidLineItem.jobBidId],
    references: [jobBid.id]
  }),
  jobConsignment: one(jobConsignment, {
    fields: [jobBidLineItem.jobConsignmentId],
    references: [jobConsignment.id]
  }),
  vehicle: one(vehicle, {
    fields: [jobBidLineItem.vehicleId],
    references: [vehicle.id]
  }),
  user: one(user, {
    fields: [jobBidLineItem.userId],
    references: [user.id]
  })
}));


export const partnershipRelations = relations(partnership, ({ one }) => ({
  sourceOrganization: one(organization, {
    fields: [partnership.sourceOrganizationId],
    references: [organization.id]
  }),
  targetOrganization: one(organization, {
    fields: [partnership.targetOrganizationId],
    references: [organization.id]
  })
}));