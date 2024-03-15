-- DropIndex
DROP INDEX "restaurant_items_name_alt_name_price_idx";

-- AlterTable
ALTER TABLE "restaurant_items" ADD COLUMN     "name_zh" TEXT;

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "name_zh" TEXT;

-- CreateIndex
CREATE INDEX "restaurant_items_name_name_zh_description_price_idx" ON "restaurant_items"("name", "name_zh", "description", "price");

-- CreateIndex
CREATE INDEX "restaurants_name_name_zh_address_price_rating_idx" ON "restaurants"("name", "name_zh", "address", "price", "rating");

-- Update
UPDATE "restaurants" SET "name_zh" = "alt_name";
