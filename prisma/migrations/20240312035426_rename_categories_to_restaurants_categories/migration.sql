/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `restaurants_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "restaurants_categories" DROP CONSTRAINT "restaurants_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "restaurants_categories" DROP CONSTRAINT "restaurants_categories_restaurant_id_fkey";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "restaurants_categories";

-- CreateTable
CREATE TABLE "restaurant_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "restaurant_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_to_category" (
    "restaurant_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "restaurant_to_category_pkey" PRIMARY KEY ("restaurant_id","category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_categories_name_key" ON "restaurant_categories"("name");

-- AddForeignKey
ALTER TABLE "restaurant_to_category" ADD CONSTRAINT "restaurant_to_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "restaurant_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant_to_category" ADD CONSTRAINT "restaurant_to_category_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
