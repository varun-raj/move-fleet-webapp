import { UserService } from "@/services/user.service"
import { Session, User } from "better-auth"
import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../auth"

interface ApiAuthWrapperProps {
  req: NextApiRequest
  res: NextApiResponse
  next: (req: NextApiRequest, res: NextApiResponse, session: {
    user: User
    session: Session
  }) => void
}

export const apiAuthWrapper = async ({ req, res, next }: ApiAuthWrapperProps) => {
  const session = await auth.api.getSession({
    headers: req.headers as never,
  })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await UserService.getUserByEmail(session.user.email)

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  next(req, res, {
    ...session,
    user,
  })
}
