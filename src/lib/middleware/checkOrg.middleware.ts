import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSessionInServer } from "../helpers/session.helper";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { member, organization, user } from "@/db/schema";
import { Session } from "better-auth";

type TOrg = NonNullable<Awaited<ReturnType<typeof getOrg>>>;
type TMember = NonNullable<Awaited<ReturnType<typeof getMember>>>;
type TUser = typeof user.$inferSelect;

// This is the actual shape of the session object
interface SessionWithUser {
  session: Session;
  user: TUser;
}

export interface CheckOrgResult {
  session: SessionWithUser;
  organization: TOrg;
  member: TMember;
}

const getOrg = async (organizationId: string) => {
  return await db.query.organization.findFirst({
    where: eq(organization.id, organizationId),
  });
};

const getMember = async (organizationId: string, userId: string) => {
  return await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, userId)
    ),
  });
};

export const checkOrg = <P extends { [key: string]: unknown }>(
  handler?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) => {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<CheckOrgResult & P>> => {
    const { organizationId } = context.params as { organizationId: string };
    const session = (await getSessionInServer(
      context.req
    )) as SessionWithUser | null;

    if (!session) {
      return {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      };
    }

    const org = await getOrg(organizationId);
    if (!org) {
      return {
        notFound: true,
      };
    }

    const mem = await getMember(organizationId, session.user.id);
    if (!mem) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    if (handler) {
      const result = await handler(context);
      if ("props" in result) {
        const props = await result.props;
        return {
          props: {
            ...props,
            session,
            organization: org,
            member: mem,
          },
        };
      }
      return result;
    }

    return {
      props: ({
        session,
        organization: org,
        member: mem,
      } as unknown) as CheckOrgResult & P,
    };
  };
}; 