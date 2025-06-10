import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { rootSchema } from "@/zod/root.zod";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return apiCheckMembership({
    req,
    res,
    next: async (req, res, session) => {
      const rootData = rootSchema.safeParse({
        organization: session.organization,
        user: session.user,
        member: session.member,
      });

      if (!rootData.success) {
        return res.status(400).json({
          error: rootData.error.message,
        });
      }

      return res.status(200).json(rootData.data);
    },
    allowedRoles: ["admin", "member"],
    allowedOrganizations: ["clearing_agency", "transporter", "delivery_agency"],
  });
}