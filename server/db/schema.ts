import { pgTable, text, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/timestamps";

// Need to be exported for the push to work even if not used
export const role = pgEnum("role", ["USER", "ADMIN", "SUPER_ADMIN"]);
export const mediaType = pgEnum("media_type", ["movie", "tv"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  userName: text(),
  password: text(),
  role: role().default("USER"),
  ...timestamps,
});

export const media = pgTable("media", {
  mediaId: integer().primaryKey(),
  name: text(),
  first_air_date: text(),
  overview: text(),
  imgURL: text(),
  averageRating: text(), // float
  media_type: mediaType(),
  voteCount: integer(),
  ...timestamps,
});

export const watched = pgTable("watched", {
  id: uuid().defaultRandom().primaryKey(),
  mediaId: integer().references(() => media.mediaId, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  rating: integer(), // 0-5
  ...timestamps,
});

export const watchList = pgTable("watchList", {
  id: uuid().defaultRandom().primaryKey(),
  mediaId: integer().references(() => media.mediaId, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...timestamps,
});

export const favorites = pgTable("favorites", {
  id: uuid().defaultRandom().primaryKey(),
  mediaId: integer().references(() => media.mediaId, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...timestamps,
});

export const diary = pgTable("diary", {
  id: uuid().defaultRandom().primaryKey(),
  mediaId: integer().references(() => media.mediaId, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  userId: uuid().references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  rating: integer(), // 0-5
  review: text(),
  ...timestamps,
});
