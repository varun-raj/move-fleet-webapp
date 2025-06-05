
import { auth } from "../auth";
import { IncomingMessage } from "http";

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
  console.log(session);
  return session;
};