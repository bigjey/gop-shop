/*
  Warnings:

  - Made the column `specPresetId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_specPresetId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "specPresetId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_specPresetId_fkey" FOREIGN KEY ("specPresetId") REFERENCES "SpecPreset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
