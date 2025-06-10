import { NextApiRequest, NextApiResponse } from "next";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { OrganizationService } from "@/services/organization.service";
import { JobService } from "@/services/job.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["owner", "admin", "member"],
    allowedOrganizations: ["transporter"],
    next: async (req, res, session) => {
      if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      }

      try {
        const { organization } = session;
        const partnerIds = await OrganizationService.getPartnerIds(
          organization.id
        );

        if (partnerIds.length === 0) {
          return res.status(200).json([]);
        }

        const jobs = await JobService.getBiddableJobs(partnerIds);

        res.status(200).json(jobs);
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
