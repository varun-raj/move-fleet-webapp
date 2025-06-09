import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getSessionInServer } from "../helpers/session.helper";
import { user } from "@/db/schema";
import { Session } from "better-auth";
import { OrganizationService } from "@/services/organization.service";

type TOrg = NonNullable<Awaited<ReturnType<typeof OrganizationService.getOrgBySlug>>>;
type TMember = NonNullable<Awaited<ReturnType<typeof OrganizationService.getMember>>>;
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


export const checkOrg = <P extends { [key: string]: unknown }>(
  handler?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) => {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<CheckOrgResult & P>> => {
    const { organizationSlug } = context.params as { organizationSlug: string };
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

    const org = await OrganizationService.getOrgBySlug(organizationSlug);
    if (!org) {
      return {
        notFound: true,
      };
    }

    const mem = await OrganizationService.getMember(org.id, session.user.id);
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