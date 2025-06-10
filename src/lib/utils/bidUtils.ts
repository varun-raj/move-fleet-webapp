import { FindJobListItem } from "../apiHandlers/job.apiHandler";
import { Vehicle } from "@/db/schema";

interface VehicleCapacity {
  "20ft": number;
  "40ft": number;
}

export const calculateVehicleCapacity = (
  vehicles: Vehicle[]
): VehicleCapacity => {
  return vehicles.reduce(
    (acc: VehicleCapacity, vehicle) => {
      if (vehicle.floorSize === "20ft") {
        acc["20ft"]++;
      } else if (vehicle.floorSize === "40ft") {
        acc["40ft"]++;
      }
      return acc;
    },
    { "20ft": 0, "40ft": 0 }
  );
};

interface RemainingConsignments {
  "20ft": number;
  "40ft": number;
}

export const calculateRemainingConsignments = (
  job: FindJobListItem,
  selectedCapacity: VehicleCapacity
): RemainingConsignments => {
  let remaining40ft = job.fortyFtConsignments;
  let remaining20ft = job.twentyFtConsignments;

  const tempCapacity40ft = selectedCapacity["40ft"];

  // Use 40ft vehicles for 40ft consignments first
  const used40ftFor40ft = Math.min(tempCapacity40ft, remaining40ft);
  remaining40ft -= used40ftFor40ft;
  const remaining40ftVehicleCapacity = tempCapacity40ft - used40ftFor40ft;

  // Use remaining 40ft vehicle capacity for 20ft consignments (1 40ft vehicle = 2 20ft slots)
  const capacity20ftFrom40ftVehicles = remaining40ftVehicleCapacity * 2;
  const used20ftFrom40ftVehicles = Math.min(
    capacity20ftFrom40ftVehicles,
    remaining20ft
  );
  remaining20ft -= used20ftFrom40ftVehicles;

  // Use 20ft vehicles for remaining 20ft consignments
  const used20ftFrom20ftVehicles = Math.min(
    selectedCapacity["20ft"],
    remaining20ft
  );
  remaining20ft -= used20ftFrom20ftVehicles;

  return { "20ft": remaining20ft, "40ft": remaining40ft };
};

export const isBidValid = (remainingConsignments: RemainingConsignments): boolean => {
  return remainingConsignments['20ft'] <= 0 && remainingConsignments['40ft'] <= 0;
} 