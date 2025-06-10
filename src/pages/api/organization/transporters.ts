import { apiAuthWrapper } from "@/lib/apiMiddleware/checkAuth.apiMiddleware";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { organization } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiAuthWrapper({
    req,
    res,
    next: async (req, res) => {
      try {
        const transporters = await db
          .select()
          .from(organization)
          .where(eq(organization.organizationType, "transporter"));
        res.status(200).json(transporters);
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