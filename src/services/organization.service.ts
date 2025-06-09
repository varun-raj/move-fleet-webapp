import { db } from "@/db";
import { member, organization } from "@/db/schema";
import { dateToISOString } from "@/lib/utils/data.helpers";
import { and, eq } from "drizzle-orm";

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
}