import { apiAuthWrapper } from "@/lib/apiMiddleware/checkAuth.apiMiddleware";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return await apiAuthWrapper({
    req,
    res,
    next: (req, res, session) => {
      res.status(200).json(session);
    }
  })
}
