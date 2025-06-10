
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

        const partners = await OrganizationService.getPartners(organization.id);
        if (partners.length === 0) {
          return res
            .status(404)
            .json({ error: "Organization not found or you are not a member" });
        }

        res.status(200).json(partners);
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