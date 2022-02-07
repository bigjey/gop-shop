/*
  Warnings:

  - A unique constraint covering the columns `[productId,specPresetGroupItemId]` on the table `SpecValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "productId_specPresetGroupItemId_unique_constraint" ON "SpecValue"("productId", "specPresetGroupItemId");
