import { relations } from "drizzle-orm";
import { user } from "./auth";
import { organization, member, invitation, partnership } from "./organization";
import { vehicle } from "./vehicle";
import { job, jobBid, jobBidLineItem, jobConsignment, } from "./job";

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
  vehicles: many(vehicle)
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
export const vehicleRelations = relations(vehicle, ({ one }) => ({
  organization: one(organization, {
    fields: [vehicle.organizationId],
    references: [organization.id]
  }),
  user: one(user, {
    fields: [vehicle.userId],
    references: [user.id]
  })
}));

// Job relationships
export const jobRelations = relations(job, ({ many, one }) => ({
  jobBids: many(jobBid),
  jobBidLineItems: many(jobBidLineItem),
  jobConsignments: many(jobConsignment),
  user: one(user, {
    fields: [job.userId],
    references: [user.id]
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
  })
}));

// JobRequest relationships
export const jobBidRelations = relations(jobBid, ({ one }) => ({
  job: one(job, {
    fields: [jobBid.jobId],
    references: [job.id]
  }),
  user: one(user, {
    fields: [jobBid.userId],
    references: [user.id]
  }),
  vehicle: one(vehicle, {
    fields: [jobBid.vehicleId],
    references: [vehicle.id]
  })
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

