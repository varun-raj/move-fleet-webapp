import { db } from "@/db";
import { location, member, organization, user } from "@/db/schema";
import { dateToISOString } from "@/lib/utils/data.helpers";
import { and, eq, or } from "drizzle-orm";

export class OrganizationService {
  static async getOrgBySlug(slug: string) {
    return await db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    }).then((org) => dateToISOString(org));
  }

  static async getMember(orgId: string, userId: string) {
    return await db.query.member.findFirst({
      where: and(eq(member.organizationId, orgId), eq(member.userId, userId)),
    }).then((mem) => dateToISOString(mem));
  }

  static async getLocationById(locationId: string, organizationId: string) {
    return await db.query.location.findFirst({
      where: and(eq(location.id, locationId), or(eq(location.organizationId, organizationId), eq(location.privacy, false))),
    }).then((loc) => dateToISOString(loc));
  }
}