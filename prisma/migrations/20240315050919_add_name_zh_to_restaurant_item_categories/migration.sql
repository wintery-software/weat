-- DropIndex
DROP INDEX "restaurant_item_categories_name_idx";

-- AlterTable
ALTER TABLE "restaurant_item_categories" ADD COLUMN     "name_zh" TEXT;
