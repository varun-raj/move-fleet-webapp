import { db } from "@/db";
import { jobBid, jobConsignment, jobBidLineItem } from "@/db/schema";
import { eq } from "drizzle-orm";

export class BidService {
  static async updateBidItems(bidId: string, updates: Array<{ bidLineItemId: string; consignmentId: string; status: "accepted" | "rejected" }>) {
    const bid = await db.query.jobBid.findFirst({
      where: eq(jobBid.id, bidId),
      with: {
        bidLineItems: true,
      },
    });

    if (!bid) {
      throw new Error("Bid not found");
    }

    // Verify all line items belong to this bid
    const bidLineItemIds = bid.bidLineItems.map(item => item.id);
    const invalidUpdates = updates.filter(update => !bidLineItemIds.includes(update.bidLineItemId));
    if (invalidUpdates.length > 0) {
      throw new Error("Invalid bid line items");
    }

    return await db.transaction(async (tx) => {
      // Update bid line items and consignments
      for (const update of updates) {
        // Update bid line item status
        await tx
          .update(jobBidLineItem)
          .set({
            status: update.status,
            updatedAt: new Date(),
          })
          .where(eq(jobBidLineItem.id, update.bidLineItemId));

        // Update consignment status and assignment
        await tx
          .update(jobConsignment)
          .set({
            status: update.status === "accepted" ? "bidding_accepted" : "bidding_rejected",
            vehicleId: update.status === "accepted" ? bid.bidLineItems.find(item => item.id === update.bidLineItemId)?.vehicleId : null,
            transporterId: update.status === "accepted" ? bid.transporterId : null,
            bidLineItemId: update.status === "accepted" ? update.bidLineItemId : null,
            bidId: update.status === "accepted" ? bidId : null,
            updatedAt: new Date(),
          })
          .where(eq(jobConsignment.id, update.consignmentId));
      }

      // Update overall bid status based on line items
      const updatedBid = await tx.query.jobBid.findFirst({
        where: eq(jobBid.id, bidId),
        with: {
          bidLineItems: true,
        },
      });

      if (!updatedBid) {
        throw new Error("Failed to fetch updated bid");
      }

      const allAccepted = updatedBid.bidLineItems.every(item => item.status === "accepted");
      const allRejected = updatedBid.bidLineItems.every(item => item.status === "rejected");
      const hasAccepted = updatedBid.bidLineItems.some(item => item.status === "accepted");
      const hasRejected = updatedBid.bidLineItems.some(item => item.status === "rejected");

      let newStatus: "accepted" | "rejected" | "pending";
      if (allAccepted) {
        newStatus = "accepted";
      } else if (allRejected) {
        newStatus = "rejected";
      } else if (hasAccepted || hasRejected) {
        newStatus = "pending";
      } else {
        newStatus = "pending";
      }

      await tx
        .update(jobBid)
        .set({
          status: newStatus,
          updatedAt: new Date(),
        })
        .where(eq(jobBid.id, bidId));

      return updatedBid;
    });
  }

  static async getBidById(bidId: string) {
    return await db.query.jobBid.findFirst({
      where: eq(jobBid.id, bidId),
      with: {
        bidLineItems: {
          with: {
            vehicle: true,
            jobConsignment: true,
          },
        },
        transporter: true,
      },
    });
  }
} 