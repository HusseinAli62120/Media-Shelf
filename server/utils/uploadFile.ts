import { put } from "@vercel/blob";
import type { MultiPartData } from "h3";
import checkEnvironment from "./checkEnvrionment";

export default async function uploadFile({ file }: { file: MultiPartData }) {
  // Check the environment variable
  const appEnv = checkEnvironment();
  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file",
    });
  }

  // Validate file size (5MB limit)
  const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.data.length > maxFileSize) {
    throw createError({
      statusCode: 400,
      statusMessage: `File ${file.filename} exceeds maximum size of 5MB`,
    });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `File type ${file.type || "unknown"} not allowed. 
        Allowed types: ${allowedTypes.join(", ")}`,
    });
  }

  if (appEnv === "development") {
    const storage = useStorage("uploads");

    // Create unique filename
    const fileName = `${Date.now()}-${file.filename}`;

    // Upload file
    await storage.setItemRaw(fileName, file.data);

    return `/uploads/${fileName}`;
  }
  if (appEnv === "production") {
    // Check the .env variables
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_STORE_ID) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    }

    const vercelToken = process.env.BLOB_READ_WRITE_TOKEN as string;
    const vercelStoreId = process.env.BLOB_STORE_ID as string;

    // Upload to Vercel Blob
    const blob = await put(
      `uploads/${Date.now()}-${file.filename}`,
      file.data,
      {
        access: "private",
        contentType: file.type,
        token: vercelToken,
        storeId: vercelStoreId,
      },
    );

    return `/api/storage/${blob.pathname}`;
  }
}
