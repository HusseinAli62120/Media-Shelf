import { get } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  // Extract path (e.g. "uploads/1787877251537-Monkey.jfif")
  const path = getRouterParam(event, "path");

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "File path is required",
    });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_STORE_ID) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
      });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.BLOB_STORE_ID;

    // Get file from storage
    const blobResult = await get(path, {
      token: token,
      storeId: storeId,
      access: "private",
    });

    if (!blobResult) {
      throw createError({
        statusCode: 404,
        statusMessage: "Image not found",
      });
    }

    // Handle 304 Not Modified
    if (blobResult.statusCode === 304) {
      setResponseStatus(event, 304);
      return null;
    }

    // Set appropriate headers for the browser
    if (blobResult.blob.contentType) {
      setHeader(event, "Content-Type", blobResult.blob.contentType);
    }

    // Cache the image in the browser for performance
    setHeader(
      event,
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=3600",
    );

    return sendStream(event, blobResult.stream);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to load image",
    });
  }
});

// This is a proxy path used to serve the vercel storage images
// So instead of URL/uploads/pathname, we use URL/api/storage/uploads/pathname
// This is done to keep the storage private and secure
