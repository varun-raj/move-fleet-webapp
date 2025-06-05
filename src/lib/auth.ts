import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification, organization as organizationSchema, member, invitation } from "@/db/schema";
import { ENV } from "@/config/env";
import { v4 as uuidv4 } from "uuid";
import { organization } from "better-auth/plugins"


export const auth = betterAuth({
  baseURL: ENV.BASE_URL!,
  secret: ENV.AUTH_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      organization: organizationSchema,
      member,
      invitation,
    }
  }),
  advanced: {
    database: {
      generateId: () => uuidv4(),
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    organization()
  ]
})