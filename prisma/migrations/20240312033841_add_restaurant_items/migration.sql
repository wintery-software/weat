-- CreateTable
CREATE TABLE "restaurant_items"
(
    "id"            TEXT           NOT NULL,
    "restaurant_id" TEXT           NOT NULL,
    "name"          TEXT           NOT NULL,
    "alt_name"      TEXT,
    "description"   TEXT,
    "price"         DECIMAL(10, 2) NOT NULL,
    "image"         TEXT,
    "created_at"    TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3)   NOT NULL,

    CONSTRAINT "restaurant_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "restaurant_items_name_alt_name_price_idx" ON "restaurant_items" ("name", "alt_name", "price");

-- AddForeignKey
ALTER TABLE "restaurant_items"
    ADD CONSTRAINT "restaurant_items_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
