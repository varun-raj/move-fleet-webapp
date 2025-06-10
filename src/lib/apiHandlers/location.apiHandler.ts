import { CREATE_LOCATION_PATH, LIST_LOCATIONS_PATH } from "@/config/routes";
import { Location } from "@/db/schema";
import { LocationCreate } from "@/components/dashboard/locations/CreateLocation";
import API from "../utils/API";

export const listLocations = async (
  organizationSlug: string
): Promise<Location[]> => {
  return API.get(LIST_LOCATIONS_PATH(organizationSlug)) as Promise<Location[]>;
};

export const createLocation = async ({
  location,
  organizationSlug,
}: {
  location: LocationCreate;
  organizationSlug: string;
}): Promise<Location> => {
  return API.post(
    CREATE_LOCATION_PATH(organizationSlug),
    location
  ) as Promise<Location>;
}; 