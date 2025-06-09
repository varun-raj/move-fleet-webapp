import { db } from "@/db";
import { apiAuthWrapper } from "@/lib/apiMiddleware/checkAuth.apiMiddleware";
import { member, organization } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import { eq } from "drizzle-orm";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await apiAuthWrapper({
    req,
    res,
    next: async (req, res, session) => {
      try {
        const { user } = session;
        const { name, slug, organizationType } = req.body;
        if (!name || !slug || !organizationType) {
          return res.status(400).json({ error: "Missing required fields" });
        }
        const alreadyExists = await db.select().from(organization).where(eq(organization.slug, slug)).execute();
        if (alreadyExists.length > 0) {
          return res.status(400).json({ error: "Organization already exists" });
        }
        const [organizationFromDB] = await db.insert(organization).values({
          id: uuidv4(),
          name,
          slug,
          organizationType,
          createdAt: new Date()
        }).returning().execute();

        console.log(organizationFromDB);
        if (organizationFromDB) {
          // Add the user as an admin to the organization
          await db.insert(member).values({
            id: uuidv4(),
            createdAt: new Date(),
            userId: user.id,
            organizationId: organizationFromDB.id,
            role: "admin",
          });
        }

        res.status(200).json(organizationFromDB);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error", message: (error as Error).message });
      }
    }
  })
}