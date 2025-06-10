import { db } from "@/db";
import { location, member, organization, partnership } from "@/db/schema";
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

  static async getPartnership(sourceOrganizationId: string, targetOrganizationId: string) {
    return await db.query.partnership.findFirst({
      where: or(
        and(
          eq(partnership.sourceOrganizationId, sourceOrganizationId),
          eq(partnership.targetOrganizationId, targetOrganizationId)
        ),
        and(eq(partnership.sourceOrganizationId, targetOrganizationId),
          eq(partnership.targetOrganizationId, sourceOrganizationId))
      ),
    }).then((part) => dateToISOString(part));
  }

  static async getPartners(organizationId: string) {
    return await db.query.partnership.findMany({
      where: or(
        eq(partnership.sourceOrganizationId, organizationId),
        eq(partnership.targetOrganizationId, organizationId)
      ),
      with: {
        targetOrganization: true,
      },
    })
  }
}