
import { auth } from "../auth";
import { IncomingMessage } from "http";
import { UserService } from "@/services/user.service";
import { Session, User } from "better-auth";

interface SessionWithUser {
  session: Session & {
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
  };
  user: User & {
    createdAt: string;
    updatedAt: string;
  };
}

export const parseHeaders = (req: IncomingMessage) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    headers.set(key, value as string);
  }
  return headers;
};

export const getSessionInServer = async (req: IncomingMessage) => {
  const headers = parseHeaders(req);

  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    return null;
  }

  const user = await UserService.getUserByEmail(session.user.email);
  return {
    session: {
      ...session.session,
      expiresAt: session.session.expiresAt.toISOString(),
      createdAt: session.session.createdAt.toISOString(),
      updatedAt: session.session.updatedAt.toISOString(),
    },
    user: {
      ...user,
      createdAt: user?.createdAt?.toISOString(),
      updatedAt: user?.updatedAt?.toISOString(),
    },
  } as SessionWithUser;
};