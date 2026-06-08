import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Schema Path
  schema: "./server/db/schema.ts",

  // Migration Output Path
  out: "./server/db/migrations",

  // DB dialect
  dialect: "postgresql",

  // Database URL
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
