
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
    allowedRoles: ["admin", "member"],
    allowedOrganizations: ["clearing_agency"],
    next: async (req, res, session) => {
      const { organization } = session;

      if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

      const { jobId } = req.query;

      if (!jobId) return res.status(400).json({ error: "Job ID is required" });

      const job = await JobService.getJobById(jobId as string);

      if (job.organizationId !== organization.id) return res.status(403).json({ error: "You are not authorized to access this job" });

      const jobConsignments = await JobService.getJobConsignments(jobId as string);

      return res.status(200).json({ ...job, consignments: jobConsignments });
    },
  });
}