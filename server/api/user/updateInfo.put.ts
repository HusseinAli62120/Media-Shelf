import { eq } from "drizzle-orm";
import { users } from "~~/server/db/schema";
import { db } from "~~/server/utils/drizzleDriver";
import { Role } from "#shared/enums/Role";
import type { MultiPartData } from "h3";
import checkEnvironment from "~~/server/utils/checkEnvrionment";
import { del } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId, profileImg } = await requireAuth({ event: event });

    // Check environment
    const appEnv = checkEnvironment();

    // Read the multipart form data
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    let file: MultiPartData | null = null;
    const fields: Record<string, string> = {};

    for (const item of formData) {
      if (item.name === "profileImg" && item.filename) {
        file = item;
      } else if (item.name) {
        fields[item.name] = item.data.toString("utf-8");
      }
    }

    const userName = fields.userName?.trim();
    const description = fields.description || null;
    const isImageChanged = fields.isImageChanged === "true";
    const changePassword = fields.changePassword === "true";
    const currentPassword = fields.currentPassword;
    const newPassword = fields.newPassword;

    // Check request parameters
    if (!userName || userName.length < 4) {
      throw createError({
        statusCode: 400,
        statusMessage: "Username must be at least 4 characters long",
      });
    }

    let newImage = profileImg ?? undefined;

    // Check if the user image has changed
    if (isImageChanged) {
      const storage = useStorage("uploads");

      // Check if a new file has been uploaded, if so, delete the old image (if it exists) and upload the new one
      if (file) {
        if (profileImg) {
          if (appEnv === "development") {
            // get the timestamp-filename from path
            const oldKey = profileImg.replace(/^\/uploads\//, "");
            await storage.removeItem(oldKey);
          }
          if (appEnv === "production") {
            let blobPath = profileImg.replace(/^\/api\/storage\//, "");
            await del(blobPath, {
              storeId: process.env.BLOB_STORE_ID,
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
          }
        }
        newImage = await uploadFile({ file: file });
      } else {
        // Old image was removed but no new image was uploaded
        if (profileImg) {
          if (appEnv === "development") {
            const oldKey = profileImg.replace(/^\/uploads\//, "");
            await storage.removeItem(oldKey);
          }
          if (appEnv === "production") {
            const blobPath = profileImg.replace(/^\/api\/storage\//, "");
            await del(blobPath, {
              storeId: process.env.BLOB_STORE_ID,
              token: process.env.BLOB_READ_WRITE_TOKEN,
            });
          }
        }
        newImage = undefined;
      }
    }

    // Check if the username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userName, userName))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0]?.id !== userId) {
      throw createError({
        statusCode: 409,
        statusMessage: "Username already exists",
      });
    }

    // If password changed, update it
    if (changePassword) {
      if (!currentPassword || !newPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: "Current and new password are required",
        });
      }

      if (newPassword.length < 8) {
        throw createError({
          statusCode: 400,
          statusMessage: "New password must be at least 8 characters long",
        });
      }

      // Get stored password for verification
      const storedUser = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!storedUser.length || !storedUser[0]?.password) {
        throw createError({
          statusCode: 404,
          statusMessage: "User not found",
        });
      }

      // Check if the current password is correct using verifyPassword
      const isPasswordValid = await verifyPassword(
        storedUser[0].password,
        currentPassword,
      );

      if (!isPasswordValid) {
        throw createError({
          statusCode: 401,
          statusMessage: "Incorrect Password",
        });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, userId));
    }

    // Update user info
    const updatedUser = await db
      .update(users)
      .set({
        userName: userName,
        description: description,
        profileImg: newImage ? newImage : null,
      })
      .where(eq(users.id, userId))
      .returning({ role: users.role });

    // Update the session
    await replaceUserSession(event, {
      user: {
        id: userId,
        userName: userName,
        role: updatedUser[0]?.role as Role,
        description: description ?? undefined,
        profileImg: newImage ? newImage : null,
      },
    });

    return {
      statusCode: 200,
      statusMessage: "Profile updated successfully",
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
