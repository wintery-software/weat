/*
  Warnings:

  - A unique constraint covering the columns `[restaurant_id,category_id,name]` on the table `restaurant_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "restaurant_items_restaurant_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_items_restaurant_id_category_id_name_key" ON "restaurant_items"("restaurant_id", "category_id", "name");
