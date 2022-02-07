/*
  Warnings:

  - You are about to drop the `ProductSpecValue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSpecValue" DROP CONSTRAINT "ProductSpecValue_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSpecValue" DROP CONSTRAINT "ProductSpecValue_specPresetGroupItemId_fkey";

-- DropTable
DROP TABLE "ProductSpecValue";

-- CreateTable
CREATE TABLE "SpecValue" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "specPresetGroupItemId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SpecValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpecValue" ADD CONSTRAINT "SpecValue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecValue" ADD CONSTRAINT "SpecValue_specPresetGroupItemId_fkey" FOREIGN KEY ("specPresetGroupItemId") REFERENCES "SpecPresetGroupItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
