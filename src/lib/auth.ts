import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { ENV } from "@/config/env";
import { v4 as uuidv4 } from "uuid";

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
  advanced: {
    database: {
      generateId: () => uuidv4(),
    }
  },
  emailAndPassword: {
    enabled: true,
  },
})