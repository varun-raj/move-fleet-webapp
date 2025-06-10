import { db } from "@/db";
import { jobBid, jobBidLineItem } from "@/db/schema";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const bidSchema = z.object({
  vehicleIds: z.array(z.string().uuid()).min(1, "At least one vehicle is required"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin", "owner", "member"],
    allowedOrganizations: ["transporter"],
    next: async (req, res, session) => {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const { user, organization } = session;
      const { jobId } = req.query;

      if (typeof jobId !== "string") {
        return res.status(400).json({ error: "Job ID is required" });
      }

      try {
        const parsedBody = bidSchema.safeParse(req.body);
        if (!parsedBody.success) {
          return res.status(400).json({ error: "Invalid request body", details: parsedBody.error.issues });
        }

        const { vehicleIds } = parsedBody.data;

        await db.transaction(async (tx) => {
          const newBid = await tx
            .insert(jobBid)
            .values({
              jobId,
              transporterId: organization.id,
              userId: user.id,
            })
            .returning({ id: jobBid.id });

          const bidId = newBid[0].id;

          const bidLineItems = vehicleIds.map((vehicleId) => ({
            jobBidId: bidId,
            jobId,
            vehicleId,
            transporterId: organization.id,
            userId: user.id,
          }));

          await tx.insert(jobBidLineItem).values(bidLineItems);
        });

        return res.status(201).json({ message: "Bid placed successfully" });
      } catch (error) {
        console.error("Failed to place bid:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    },
  });
} 