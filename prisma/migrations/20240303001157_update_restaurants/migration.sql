-- DropIndex
DROP INDEX "restaurants_google_maps_place_id_key";

-- AlterTable
ALTER TABLE "restaurants"
    RENAME COLUMN "google_maps_place_id" TO "place_id";

ALTER TABLE "restaurants"
    DROP COLUMN "google_maps_url",
    ADD COLUMN "alt_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "restaurants_place_id_key" ON "restaurants" ("place_id");
