/*
  Warnings:

  - A unique constraint covering the columns `[restaurant_id,name]` on the table `restaurant_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `restaurant_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurant_items" ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "restaurant_item_categories" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "restaurant_item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "restaurant_item_categories_name_idx" ON "restaurant_item_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_item_categories_restaurant_id_name_key" ON "restaurant_item_categories"("restaurant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_items_restaurant_id_name_key" ON "restaurant_items"("restaurant_id", "name");

-- AddForeignKey
ALTER TABLE "restaurant_items" ADD CONSTRAINT "restaurant_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "restaurant_item_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_item_categories" ADD CONSTRAINT "restaurant_item_categories_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
