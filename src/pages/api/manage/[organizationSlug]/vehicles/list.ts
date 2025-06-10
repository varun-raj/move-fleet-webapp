import { NextApiRequest, NextApiResponse } from "next";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { VehicleService } from "@/services/vehicle.service";
import { Member, Organization } from "@/db/schema";
import { Session, User } from "better-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: {
    user: User;
    session: Session;
    organization: Organization;
    member: Member;
  }
) {
  const { organization } = session;

  if (req.method === "GET") {
    try {
      const vehicles = await VehicleService.getVehiclesByOrg(organization.id);
      return res.status(200).json(vehicles);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error getting vehicles" });
    }
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

export default async function authWrapper(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiCheckMembership({
    req,
    res,
    next: handler,
    allowedRoles: ["owner", "admin", "member"],
    allowedOrganizations: ["transporter"],
  });
} 