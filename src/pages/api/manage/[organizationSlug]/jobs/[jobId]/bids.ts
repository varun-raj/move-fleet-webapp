import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { JobService } from "@/services/job.service";
import { NextApiRequest, NextApiResponse } from "next";

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
      if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
      }

      const { jobId } = req.query;

      if (typeof jobId !== "string") {
        return res.status(400).json({ error: "Job ID is required" });
      }

      try {
        const bids = await JobService.getBidsForJob(jobId);
        return res.status(200).json(bids);
      } catch (error) {
        console.error("Failed to fetch bids:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    },
  });
} 