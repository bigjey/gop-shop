/*
  Warnings:

  - You are about to drop the `_ProductToSpecPreset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToSpecPreset" DROP CONSTRAINT "_ProductToSpecPreset_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSpecPreset" DROP CONSTRAINT "_ProductToSpecPreset_B_fkey";

-- DropTable
DROP TABLE "_ProductToSpecPreset";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_specPresetId_fkey" FOREIGN KEY ("specPresetId") REFERENCES "SpecPreset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
