import { apiAuthWrapper } from "@/lib/apiMiddleware/checkAuth.apiMiddleware";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { job, location, member, organization } from "@/db/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { alias } from "drizzle-orm/pg-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await apiAuthWrapper({
    req,
    res,
    next: async (req, res, session) => {
      try {
        const { organizationSlug } = req.query;

        if (typeof organizationSlug !== "string") {
          return res.status(400).json({ error: "Organization slug is required" });
        }

        const { user } = session;

        const orgs = await db
          .select({ id: organization.id })
          .from(organization)
          .innerJoin(member, eq(organization.id, member.organizationId))
          .where(
            and(
              eq(organization.slug, organizationSlug),
              eq(member.userId, user.id)
            )
          );

        if (orgs.length === 0) {
          return res
            .status(404)
            .json({ error: "Organization not found or you are not a member" });
        }
        const orgId = orgs[0].id;

        const fromLocation = alias(location, "fromLocation");
        const toLocation = alias(location, "toLocation");

        const jobsFromDB = await db
          .select({
            job: job,
            fromLocationName: fromLocation.name,
            toLocationName: toLocation.name,
          })
          .from(job)
          .leftJoin(fromLocation, eq(job.fromLocationId, fromLocation.id))
          .leftJoin(toLocation, eq(job.toLocationId, toLocation.id))
          .where(eq(job.organizationId, orgId))

        res.status(200).json(jobsFromDB);
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