-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_specPresetId_fkey";

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "publicId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
