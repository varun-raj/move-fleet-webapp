// Create a wrapper for serverSideProps to check if the user is authenticated

import { GetServerSidePropsContext } from "next";
import { getSessionInServer } from "../helpers/session.helper";
import { Session } from "better-auth";


interface CheckAuthResult {
  props: {
    session: Session;
  };
}

export const checkAuthSSR = (handler?: (context: GetServerSidePropsContext) => Promise<CheckAuthResult>) => {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSessionInServer(context.req);
    console.log("session", session);
    if (!session) {
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };
    }

    if (handler) {
      const result = await handler(context);
      return {
        ...result,
        props: {
          ...result.props,
          ...session,
        },
      };
    }

    return {
      props: {
        session: session,
      },
    };
  };
};