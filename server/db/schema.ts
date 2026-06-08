import { pgTable, text, uuid, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamps";

// Need to be exported for the push to work even if not used
export const role = pgEnum("role", ["USER", "ADMIN", "SUPER_ADMIN"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  userName: text(),
  password: text(),
  role: role().default("USER"),
  ...timestamps,
});
