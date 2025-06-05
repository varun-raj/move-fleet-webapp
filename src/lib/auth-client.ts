import { ENV } from "@/config/env"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: ENV.BASE_URL!
})