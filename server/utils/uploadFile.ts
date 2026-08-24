import type { MultiPartData } from "h3";

export default async function uploadFile({ file }: { file: MultiPartData }) {
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

  const storage = useStorage("uploads");

  // Create unique filename
  const fileName = `${Date.now()}-${file.filename}`;

  // Upload file
  await storage.setItemRaw(fileName, file.data);

  return `/uploads/${fileName}`;
}
