import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { BidService } from "@/services/bid.service";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateBidItemsSchema = z.object({
  updates: z.array(z.object({
    bidLineItemId: z.string(),
    consignmentId: z.string(),
    status: z.enum(["accepted", "rejected"]),
  })),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin", "owner", "member"],
    allowedOrganizations: ["clearing_agency"],
    next: async (req, res) => {
      if (req.method !== "PATCH") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const { bidId } = req.query;

      if (typeof bidId !== "string") {
        return res.status(400).json({ error: "Bid ID is required" });
      }

      try {
        const parsedBody = updateBidItemsSchema.safeParse(req.body);

        if (!parsedBody.success) {
          return res.status(400).json({ error: "Invalid request body", details: parsedBody.error.issues });
        }

        const { updates } = parsedBody.data;

        const result = await BidService.updateBidItems(bidId, updates);
        return res.status(200).json(result);
      } catch (error) {
        console.error(`Failed to update bid ${bidId}:`, error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    },
  });
} 