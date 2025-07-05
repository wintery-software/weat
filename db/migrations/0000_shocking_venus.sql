CREATE TYPE "public"."task_status" AS ENUM('PENDING', 'STARTED', 'FAILURE', 'SUCCESS');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address_1" varchar(150) NOT NULL,
	"address_2" varchar(100),
	"city" varchar(80) NOT NULL,
	"state" varchar(80) NOT NULL,
	"country" varchar(80) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	CONSTRAINT "addresses_address_1_address_2_city_state_country_postal_code_unique" UNIQUE("address_1","address_2","city","state","country","postal_code")
);
--> statement-breakpoint
CREATE TABLE "restaurant_dishes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"mention_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "restaurant_dishes_restaurant_id_name_unique" UNIQUE("restaurant_id","name")
);
--> statement-breakpoint
CREATE TABLE "restaurant_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"summary_text" text NOT NULL,
	"top_tags" jsonb NOT NULL,
	"average_rating" numeric(2, 1) NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "restaurant_summaries_restaurant_id_unique" UNIQUE("restaurant_id")
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_zh" varchar(100),
	"name_en" varchar(100),
	"address_id" uuid NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"phone_number" varchar(20),
	"google_maps_place_id" varchar(50) NOT NULL,
	"external_links" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "restaurants_google_maps_place_id_unique" UNIQUE("google_maps_place_id"),
	CONSTRAINT "name_constraint" CHECK (("restaurants"."name_zh" IS NOT NULL AND "restaurants"."name_zh" != '') OR ("restaurants"."name_en" IS NOT NULL AND "restaurants"."name_en" != ''))
);
--> statement-breakpoint
CREATE TABLE "restaurants_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"review_count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "restaurants_tags_restaurant_id_tag_id_unique" UNIQUE("restaurant_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "review_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"summary_text" text NOT NULL,
	"tags" jsonb,
	"dishes" jsonb,
	"rating" numeric(2, 1) NOT NULL,
	"authenticity_score" numeric(3, 2) NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "review_summaries_review_id_unique" UNIQUE("review_id"),
	CONSTRAINT "authenticity_score_check" CHECK ("review_summaries"."authenticity_score" >= 0 AND "review_summaries"."authenticity_score" <= 1)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"source" varchar(30) NOT NULL,
	"source_id" varchar(255) NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"crawled_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_source_source_id_restaurant_id_unique" UNIQUE("source","source_id","restaurant_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "task_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task" varchar(50) NOT NULL,
	"data" jsonb NOT NULL,
	"status" "task_status" NOT NULL,
	"status_message" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "restaurant_dishes" ADD CONSTRAINT "restaurant_dishes_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant_summaries" ADD CONSTRAINT "restaurant_summaries_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants_tags" ADD CONSTRAINT "restaurants_tags_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurants_tags" ADD CONSTRAINT "restaurants_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_summaries" ADD CONSTRAINT "review_summaries_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "restaurant_dishes_restaurant_id_index" ON "restaurant_dishes" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurant_summaries_restaurant_id_index" ON "restaurant_summaries" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurants_tags_restaurant_id_index" ON "restaurants_tags" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "restaurants_tags_tag_id_index" ON "restaurants_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "review_summaries_review_id_index" ON "review_summaries" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX "reviews_restaurant_id_index" ON "reviews" USING btree ("restaurant_id");--> statement-breakpoint
CREATE INDEX "task_queue_task_status_index" ON "task_queue" USING btree ("task","status") WHERE "task_queue"."status" = 'PENDING';