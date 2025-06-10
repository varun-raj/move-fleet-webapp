import { Organization, partnership } from "@/db/schema";
import axios from "axios";
import API from "../utils/API";
import { CREATE_PARTNERSHIP_PATH } from "@/config/routes";
import { LIST_PARTNERSHIPS_PATH } from "@/config/routes";

export type Partnership = typeof partnership.$inferSelect;
export type PartnershipWithPartner = Partnership & { targetOrganization: Organization };

export const listTransporters = async (): Promise<Organization[]> => {
  const response = await axios.get("/api/organization/transporters");
  return response.data;
};

export const createPartnership = async (
  organizationSlug: string,
  targetOrganizationId: string
): Promise<PartnershipWithPartner> => {
  return API.post(CREATE_PARTNERSHIP_PATH(organizationSlug), {
    targetOrganizationId,
  }) as Promise<PartnershipWithPartner>;
};

export const listPartnerships = async (
  organizationSlug: string
): Promise<PartnershipWithPartner[]> => {
  return API.get(LIST_PARTNERSHIPS_PATH(organizationSlug)) as Promise<PartnershipWithPartner[]>;
}; 