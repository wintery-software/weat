import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Enum for task status
export const taskStatusEnum = pgEnum("task_status", [
  "PENDING",
  "STARTED",
  "FAILURE",
  "SUCCESS",
]);

// Addresses table
export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    address1: varchar("address_1", { length: 150 }).notNull(),
    address2: varchar("address_2", { length: 100 }),
    city: varchar("city", { length: 50 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zipCode: varchar("zip_code", { length: 5 }).notNull(),
  },
  (table) => [
    unique().on(
      table.address1,
      table.address2,
      table.city,
      table.state,
      table.zipCode,
    ),
  ],
);

// Tags table
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

// Restaurants table
export const restaurants = pgTable(
  "restaurants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nameZh: varchar("name_zh", { length: 100 }),
    nameEn: varchar("name_en", { length: 100 }),
    addressId: uuid("address_id")
      .notNull()
      .references(() => addresses.id),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    phoneNumber: varchar("phone_number", { length: 10 }),
    googleMapsPlaceId: varchar("google_maps_place_id", { length: 100 })
      .notNull()
      .unique(),
    externalLinks: jsonb("external_links"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "name_constraint",
      sql`(${table.nameZh} IS NOT NULL AND ${table.nameZh} != '') OR (${table.nameEn} IS NOT NULL AND ${table.nameEn} != '')`,
    ),
  ],
);

// Restaurant dishes table
export const restaurantDishes = pgTable(
  "restaurant_dishes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
    name: varchar("name", { length: 100 }).notNull(),
    mentionCount: integer("mention_count").notNull(),
  },
  (table) => [
    unique().on(table.restaurantId, table.name),
    index().on(table.restaurantId),
  ],
);

// Restaurant summaries table
export const restaurantSummaries = pgTable(
  "restaurant_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
    summary: text("summary").notNull(),
    topTags: jsonb("top_tags").notNull(),
    averageRating: numeric("average_rating", {
      precision: 2,
      scale: 1,
    }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique().on(table.restaurantId), index().on(table.restaurantId)],
);

// Restaurant tags junction table
export const restaurantsTags = pgTable(
  "restaurants_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id),
    reviewCount: integer("review_count").notNull().default(1),
  },
  (table) => [
    unique().on(table.restaurantId, table.tagId),
    index().on(table.restaurantId),
    index().on(table.tagId),
  ],
);

// Reviews table
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
    source: varchar("source", { length: 30 }).notNull(),
    sourceId: varchar("source_id", { length: 255 }).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique().on(table.source, table.sourceId, table.restaurantId),
    index().on(table.restaurantId),
  ],
);

// Review summaries table
export const reviewSummaries = pgTable(
  "review_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => reviews.id),
    summary: text("summary").notNull(),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    dishes: text("dishes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
    authenticityScore: numeric("authenticity_score", {
      precision: 3,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique().on(table.reviewId),
    index().on(table.reviewId),
    check(
      "authenticity_score_check",
      sql`${table.authenticityScore} >= 0 AND ${table.authenticityScore} <= 1`,
    ),
  ],
);

// Task queue table
export const taskQueue = pgTable(
  "task_queue",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    task: varchar("task", { length: 50 }).notNull(),
    data: jsonb("data").notNull(),
    status: taskStatusEnum("status").notNull(),
    statusMessage: text("status_message"),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index()
      .on(table.task, table.status)
      .where(sql`${table.status} = 'PENDING'`),
  ],
);

// Relations
export const addressesRelations = relations(addresses, ({ many }) => ({
  restaurants: many(restaurants),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  address: one(addresses, {
    fields: [restaurants.addressId],
    references: [addresses.id],
  }),
  dishes: many(restaurantDishes),
  summary: one(restaurantSummaries, {
    fields: [restaurants.id],
    references: [restaurantSummaries.restaurantId],
  }),
  reviews: many(reviews),
  tags: many(restaurantsTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  restaurants: many(restaurantsTags),
}));

export const restaurantDishesRelations = relations(
  restaurantDishes,
  ({ one }) => ({
    restaurant: one(restaurants, {
      fields: [restaurantDishes.restaurantId],
      references: [restaurants.id],
    }),
  }),
);

export const restaurantSummariesRelations = relations(
  restaurantSummaries,
  ({ one }) => ({
    restaurant: one(restaurants, {
      fields: [restaurantSummaries.restaurantId],
      references: [restaurants.id],
    }),
  }),
);

export const restaurantsTagsRelations = relations(
  restaurantsTags,
  ({ one }) => ({
    restaurant: one(restaurants, {
      fields: [restaurantsTags.restaurantId],
      references: [restaurants.id],
    }),
    tag: one(tags, {
      fields: [restaurantsTags.tagId],
      references: [tags.id],
    }),
  }),
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  summary: one(reviewSummaries, {
    fields: [reviews.id],
    references: [reviewSummaries.reviewId],
  }),
}));

export const reviewSummariesRelations = relations(
  reviewSummaries,
  ({ one }) => ({
    review: one(reviews, {
      fields: [reviewSummaries.reviewId],
      references: [reviews.id],
    }),
  }),
);

// Export types
export type AddressSelect = InferSelectModel<typeof addresses>;

export type AddressInsert = InferInsertModel<typeof addresses>;

export type RestaurantSelect = InferSelectModel<typeof restaurants>;

export type RestaurantInsert = InferInsertModel<typeof restaurants>;

export type TagSelect = InferSelectModel<typeof tags>;

export type TagInsert = InferInsertModel<typeof tags>;

export type RestaurantDishSelect = InferSelectModel<typeof restaurantDishes>;

export type RestaurantDishInsert = InferInsertModel<typeof restaurantDishes>;

export type RestaurantSummarySelect = InferSelectModel<
  typeof restaurantSummaries
>;

export type RestaurantSummaryInsert = InferInsertModel<
  typeof restaurantSummaries
>;

export type RestaurantTagSelect = InferSelectModel<typeof restaurantsTags>;

export type RestaurantTagInsert = InferInsertModel<typeof restaurantsTags>;

export type ReviewSelect = InferSelectModel<typeof reviews>;

export type ReviewInsert = InferInsertModel<typeof reviews>;

export type ReviewSummarySelect = InferSelectModel<typeof reviewSummaries>;

export type ReviewSummaryInsert = InferInsertModel<typeof reviewSummaries>;

export type TaskQueueSelect = InferSelectModel<typeof taskQueue>;

export type TaskQueueInsert = InferInsertModel<typeof taskQueue>;
