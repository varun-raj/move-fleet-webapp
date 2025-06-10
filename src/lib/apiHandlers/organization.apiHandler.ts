import { CREATE_ORGANIZATION_PATH, GET_ROOT_DATA_PATH, LIST_ORGANIZATIONS_PATH } from "@/config/routes";
import API from "../utils/API";
import { Organization, OrganizationCreate } from "@/db/schema";
import { RootData } from "@/zod/root.zod";

export const listOrganizations = async (): Promise<Organization[]> => {
  return API.get(LIST_ORGANIZATIONS_PATH) as Promise<Organization[]>;
};

export const createOrganization = async (organization: OrganizationCreate): Promise<Organization> => {
  return API.post(CREATE_ORGANIZATION_PATH, organization) as Promise<Organization>;
};

export const getRootData = async (organizationSlug: string): Promise<RootData> => {
  return API.get(GET_ROOT_DATA_PATH(organizationSlug)) as Promise<RootData>;
};