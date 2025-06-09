import { CREATE_ORGANIZATION_PATH, LIST_ORGANIZATIONS_PATH } from "@/config/routes";
import API from "../utils/API";
import { Organization, OrganizationCreate } from "@/db/schema";

export const listOrganizations = async (): Promise<Organization[]> => {
  return API.get(LIST_ORGANIZATIONS_PATH) as Promise<Organization[]>;
};

export const createOrganization = async (organization: OrganizationCreate): Promise<Organization> => {
  return API.post(CREATE_ORGANIZATION_PATH, organization) as Promise<Organization>;
};

