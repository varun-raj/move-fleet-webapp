import { apiAuthWrapper } from "@/lib/apiMiddleware/checkAuth.apiMiddleware";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { member, organization } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await apiAuthWrapper({
    req,
    res,
    next: async (req, res, session) => {
      try {

        const { user } = session;

        const organizationFromDB = await db.select({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          organizationType: organization.organizationType,
          createdAt: organization.createdAt
        }).from(member)
          .where(eq(member.userId, user.id))
          .innerJoin(organization, eq(member.organizationId, organization.id));

        res.status(200).json(organizationFromDB);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error", message: (error as Error).message });
      }
    }
  })
}