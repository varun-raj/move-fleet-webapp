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
  const { organization, user } = session;

  if (req.method === "POST") {
    try {
      const newVehicle = await VehicleService.createVehicle(
        req.body,
        organization.id,
        user.id
      );
      return res.status(201).json(newVehicle);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error creating vehicle" });
    }
  }

  res.setHeader("Allow", ["POST"]);
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