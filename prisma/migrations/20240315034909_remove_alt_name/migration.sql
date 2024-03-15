/*
  Warnings:

  - You are about to drop the column `alt_name` on the `restaurant_items` table. All the data in the column will be lost.
  - You are about to drop the column `alt_name` on the `restaurants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "restaurant_items" DROP COLUMN "alt_name";

-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "alt_name";
