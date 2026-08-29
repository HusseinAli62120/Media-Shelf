import z from "zod";
import { Role } from "#shared/enums/Role";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../utils/drizzleDriver";

export default defineEventHandler(async (event) => {
  // Validate body schema
  const bodySchema = z.object({
    userName: z.string().min(4),
    password: z.string().min(8),
  });
  try {
    const { userName, password } = await readValidatedBody(event, (body) => {
      const result = bodySchema.safeParse(body);

      // Bad request if format is invalid
      if (!result.success) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid credentials format",
        });
      }

      return result.data;
    });

    // Check if the user already exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName))
      .limit(1);

    if (user.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "User already exists",
      });
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // create user
    await db.insert(users).values({
      userName: userName,
      password: hashedPassword,
      role: Role.USER,
    });

    // get the created user
    const createdUser = await db
      .select({ id: users.id, userName: users.userName, role: users.role })
      .from(users)
      .where(eq(users.userName, userName))
      .limit(1);

    // Set the user info into the session
    await setUserSession(event, {
      user: {
        id: createdUser[0]?.id!,
        userName: createdUser[0]?.userName!,
        role: createdUser[0]?.role! as Role,
        description: null,
        profileImg: null,
      },
    });

    return {
      statusCode: 200,
      statusMessage: "Sign up successful",
    };
  } catch (error) {
    console.log(error);

    // Throw the errors from the try
    if (error) {
      throw error;
    }

    // Fallback if no error was thrown, but we reached this
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
