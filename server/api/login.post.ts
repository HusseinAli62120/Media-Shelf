import { z } from "zod";
import { Role } from "#shared/enums/Role";
import { db } from "../utils/drizzleDriver";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// Validate body schema
const bodySchema = z.object({
  userName: z.string().min(4),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  try {
    const { userName, password } = await readValidatedBody(event, (body) => {
      const result = bodySchema.safeParse(body);

      // Bad request if format is invalid
      if (!result.success) {
        throw createError({
          status: 400,
          message: "Invalid credentials format",
        });
      }

      return result.data;
    });

    // Check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName))
      .limit(1);

    if (user.length === 0) {
      throw createError({
        status: 404,
        message: "User not found",
      });
    }

    // Check if the password is correct
    const isPasswordValid = await verifyPassword(user[0]?.password!, password);
    if (!isPasswordValid) {
      throw createError({
        status: 401,
        message: "Incorrect username or password",
      });
    }

    // Set the user session to the data fetched from the db.
    await setUserSession(event, {
      user: {
        id: user[0]?.id!,
        userName: user[0]?.userName!,
        role: user[0]?.role! as Role,
        description: user[0]?.description ?? null,
        profileImg: user[0]?.profileImg ?? null,
      },
    });
    return {
      status: 200,
      message: "Login successful",
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      status: 500,
      message: "Internal Server Error",
    });
  }
});
