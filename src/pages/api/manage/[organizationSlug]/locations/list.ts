import { db } from "@/db";
import { eq } from "drizzle-orm";
import { location } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin", "member"],
    allowedOrganizations: ["clearing_agency", "transporter", "delivery_agency"],
    next: async (req, res, session) => {
      try {
        const { organization } = session;
        const locationsFromDB = await db
          .select()
          .from(location)
          .where(eq(location.organizationId, organization.id));

        res.status(200).json(locationsFromDB);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Internal server error",
          message: (error as Error).message,
        });
      }
    },
  });
} 