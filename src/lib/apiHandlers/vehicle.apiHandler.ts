import { Vehicle, VehicleCreate } from "@/db/schema";
import API from "../utils/API";
import {
  CREATE_VEHICLE_PATH,
  LIST_VEHICLES_PATH,
} from "@/config/routes";

export const createVehicle = async (
  vehicle: VehicleCreate,
  organizationSlug: string
): Promise<Vehicle> => {
  return API.post(
    CREATE_VEHICLE_PATH(organizationSlug),
    vehicle
  ) as Promise<Vehicle>;
};

export const listVehicles = async (
  organizationSlug: string,
  filters: { status?: string } = { status: undefined }
): Promise<Vehicle[]> => {
  return API.get(LIST_VEHICLES_PATH(organizationSlug), { params: filters }) as Promise<Vehicle[]>;
}; 
