import { db } from "@/db";
import { vehicle, Vehicle } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

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

  static async updateVehicle(vehicleId: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const updatedVehicle = await db
      .update(vehicle)
      .set(data)
      .where(eq(vehicle.id, vehicleId))
      .returning();
    return updatedVehicle[0];
  }

  static async getVehiclesByOrg(organizationId: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicle)
      .where(eq(vehicle.organizationId, organizationId));
  }

  static async getAvailableVehicles(organizationId: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicle)
      .where(
        and(
          eq(vehicle.organizationId, organizationId),
          ne(vehicle.status, 'in_job'),
          ne(vehicle.status, 'out_of_service'),
          ne(vehicle.status, 'maintenance'),
          ne(vehicle.status, 'inactive'),
        )
      );
  }


} 