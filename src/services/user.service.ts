import { User } from "better-auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export class UserService {
  static async getUserByEmail(email: string): Promise<User | undefined> {
    const userData = await db.query.user.findFirst({
      where: eq(user.email, email.toLowerCase()),
    });

    return userData;
  }

  static async getUserById(id: string): Promise<User | undefined> {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, id),
    });

    return userData;
  }
}