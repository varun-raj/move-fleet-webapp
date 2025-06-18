import { NextApiRequest, NextApiResponse } from "next";
import { JobService } from "@/services/job.service";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { Organization } from "@/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin", "member"],
    allowedOrganizations: ["transporter"],
    next: async (
      req: NextApiRequest,
      res: NextApiResponse,
      { organization }: { organization: Organization }
    ) => {
      try {
        const jobs = await JobService.getTransporterJobs(
          organization.id
        );
        return res.status(200).json(jobs);
      } catch (error) {
        console.error("Error fetching assigned jobs:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  });
} 