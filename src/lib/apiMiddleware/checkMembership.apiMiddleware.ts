import { UserService } from "@/services/user.service"
import { Session, User } from "better-auth"
import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../auth"
import { OrganizationService } from "@/services/organization.service"
import { Member, Organization } from "@/db/schema"

interface ApiAuthWrapperProps {
  req: NextApiRequest
  res: NextApiResponse
  allowedRoles: ("admin" | "member")[]
  allowedOrganizations: ("clearing_agency" | "transporter" | "delivery_agency")[]
  next: (req: NextApiRequest, res: NextApiResponse, session: {
    user: User
    session: Session
    organization: Organization,
    member: Member,
  }) => void
}

export const apiCheckMembership = async ({ req, res, next, allowedRoles, allowedOrganizations }: ApiAuthWrapperProps) => {
  const session = await auth.api.getSession({
    headers: req.headers as never,
  })

  if (!session) {
    return res.status(401).json({ message: 'Unauthenticated' })
  }

  const user = await UserService.getUserByEmail(session.user.email)

  if (!user) {
    return res.status(403).json({ message: 'Unauthenticated' })
  }

  const organizationSlug = req.query.organizationSlug as string

  const organization = await OrganizationService.getOrgBySlug(organizationSlug)

  if (!organization) {
    return res.status(403).json({ message: 'Unauthorized', error: 'Organization not found' })
  }

  if (!allowedOrganizations.includes(organization.organizationType)) {
    return res.status(403).json({ message: 'Unauthorized', error: `Organization Type ${organization.organizationType} not allowed. Allowed Types: ${allowedOrganizations.join(', ')}` })
  }

  const member = await OrganizationService.getMember(organization.id, user.id)

  if (!member) {
    return res.status(403).json({ message: 'Unauthorized', error: 'Member not found' })
  }

  if (!allowedRoles.includes(member.role)) {
    return res.status(403).json({ message: 'Unauthorized', error: `Role ${member.role} not allowed. Allowed Roles: ${allowedRoles.join(', ')}` })
  }

  next(req, res, {
    ...session,
    user,
    organization,
    member,
  })
}
