import { db } from "@/db";
import { location } from "@/db/schema/location";
import { apiCheckMembership } from "@/lib/apiMiddleware/checkMembership.apiMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  locationCoordinates: z.array(z.number()).min(2, "Location coordinates are required"),
  privacy: z.boolean().default(false),
  locationType: z.enum(["yard", "warehouse"]).default("yard"),
});

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
      const { user, organization } = session;

      if (req.method === "POST") {
        try {
          const parsedBody = formSchema.safeParse(req.body);
          if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid request body" });
          }

          const newLocation = await db
            .insert(location)
            .values({
              ...parsedBody.data,
              locationCoordinates: [parsedBody.data.locationCoordinates[0], parsedBody.data.locationCoordinates[1]],
              organizationId: organization.id,
              userId: user.id,
            })
            .returning();

          return res.status(201).json({ location: newLocation[0] });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }

      return res.status(405).json({ error: "Method Not Allowed" });
    },
  });
} 