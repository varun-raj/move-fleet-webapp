
import { NextApiRequest, NextApiResponse } from "next";
import { OrganizationService } from "@/services/organization.service";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiCheckMembership({
    req,
    res,
    allowedRoles: ["admin"],
    allowedOrganizations: ["clearing_agency"],
    next: async (req, res, session) => {
      try {
        const { organization } = session;

        const nonPartners = await OrganizationService.getNonPartners(organization.id);
        res.status(200).json(nonPartners);
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