import { ENV } from "@/config/env"
import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: ENV.BASE_URL!,
  plugins: [
    organizationClient(),
  ]
})