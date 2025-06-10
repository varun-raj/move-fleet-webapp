import { db } from "@/db";
import { vehicle, Vehicle } from "@/db/schema";
import { eq } from "drizzle-orm";

export type VehicleCreate = Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "organizationId" | "userId">;

export class VehicleService {
  static async createVehicle(
    data: VehicleCreate,
    organizationId: string,
    userId: string
  ): Promise<Vehicle> {
    const newVehicle = await db
      .insert(vehicle)
      .values({
        ...data,
        organizationId,
        userId,
      })
      .returning();
    return newVehicle[0];
  }

  static async getVehiclesByOrg(organizationId: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicle)
      .where(eq(vehicle.organizationId, organizationId));
  }
} 