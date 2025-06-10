import { z } from "zod";

export const rootSchema = z.object({
  organization: z.object({
    organizationType: z.enum(["clearing_agency", "transporter", "delivery_agency"]),
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  member: z.object({
    id: z.string(),
    role: z.enum(["admin", "member"]),
  }),
});

export type RootData = z.infer<typeof rootSchema>;