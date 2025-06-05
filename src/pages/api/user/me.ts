import { getSessionInServer } from "@/lib/helpers/session.helper";
import { checkAuth } from "@/lib/middleware/checkAuth.middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSessionInServer(req);
  res.status(200).json(session);
}

export const getServerSideProps = checkAuth;