import { db } from "@/db";
import { job, jobConsignment } from "@/db/schema/job";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { OrganizationService } from "@/services/organization.service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const consignmentSchema = z.object({
  containerIdentifier: z.string().min(1, "Container identifier is required"),
  containerType: z.enum(["20ft", "40ft"]),
});

const formSchema = z.object({
  fromLocationId: z.string().min(1, "From location is required"),
  toLocationId: z.string().min(1, "To location is required"),
  dueDate: z.string().min(1, "Due date is required"),
  consignments: z.array(consignmentSchema).min(1, "At least one consignment is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin"],
    allowedOrganizations: ["clearing_agency"],
    next: async (req, res, session) => {
      const { user, organization, member } = session;

      if (req.method === "POST") {
        try {
          const parsedBody = formSchema.safeParse(req.body);
          if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid request body", details: parsedBody.error.issues });
          }

          const { fromLocationId, toLocationId, dueDate, consignments } = parsedBody.data;

          const fromLocation = await OrganizationService.getLocationById(fromLocationId, organization.id);
          const toLocation = await OrganizationService.getLocationById(toLocationId, organization.id);

          if (!fromLocation || !toLocation) {
            return res.status(400).json({ error: "Invalid locations" });
          }

          const newJob = await db
            .insert(job)
            .values({
              fromLocationId,
              toLocationId,
              dueDate: new Date(dueDate),
              organizationId: organization.id,
              userId: user.id,
            })
            .returning();

          const newConsignments = consignments.map((c) => ({
            ...c,
            jobId: newJob[0].id,
            userId: member.userId,
          }));

          await db.insert(jobConsignment).values(newConsignments);

          return res.status(201).json({ job: newJob[0] });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }

      return res.status(405).json({ error: "Method Not Allowed" });
    },
  });
}