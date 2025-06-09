import { relations } from "drizzle-orm";
import { user } from "./auth";
import { organization, member, invitation, partnership } from "./organization";
import { vehicle } from "./vehicle";
import { job, jobRequest } from "./job";

// User relationships
export const userRelations = relations(user, ({ many }) => ({
  members: many(member),
  invitationsSent: many(invitation, { relationName: "inviter" }),
  vehicles: many(vehicle),
  jobRequests: many(jobRequest)
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
export const jobRelations = relations(job, ({ many }) => ({
  jobRequests: many(jobRequest)
}));

// JobRequest relationships
export const jobRequestRelations = relations(jobRequest, ({ one }) => ({
  job: one(job, {
    fields: [jobRequest.jobId],
    references: [job.id]
  }),
  user: one(user, {
    fields: [jobRequest.userId],
    references: [user.id]
  }),
  vehicle: one(vehicle, {
    fields: [jobRequest.vehicleId],
    references: [vehicle.id]
  })
}));