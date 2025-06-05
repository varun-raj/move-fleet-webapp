import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { ENV } from "@/config/env";

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
    }
  }),
  emailAndPassword: {
    enabled: true,
  },
})