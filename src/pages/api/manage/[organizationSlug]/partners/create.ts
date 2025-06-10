import { db } from "@/db";
import { partnership } from "@/db/schema";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { OrganizationService } from "@/services/organization.service";

const formSchema = z.object({
  targetOrganizationId: z.string().uuid("Invalid organization ID"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin"],
    allowedOrganizations: ["clearing_agency"],
    next: async (req, res, session) => {
      const { organization: sourceOrganization } = session;

      if (req.method === "POST") {
        try {
          const parsedBody = formSchema.safeParse(req.body);
          if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid request body" });
          }
          const { targetOrganizationId } = parsedBody.data;

          const existingPartnership = await OrganizationService.getPartnership(sourceOrganization.id, targetOrganizationId);

          if (existingPartnership) {
            return res.status(409).json({ error: "Partnership already exists" });
          }

          const newPartnership = await db
            .insert(partnership)
            .values({
              sourceOrganizationId: sourceOrganization.id,
              targetOrganizationId: targetOrganizationId,
            })
            .returning();

          return res.status(201).json({ partnership: newPartnership[0] });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }

      return res.status(405).json({ error: "Method Not Allowed" });
    },
  });
} 