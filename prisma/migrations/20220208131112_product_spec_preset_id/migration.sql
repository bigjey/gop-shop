-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "specPresetId" INTEGER;

-- CreateTable
CREATE TABLE "_ProductToSpecPreset" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSpecPreset_AB_unique" ON "_ProductToSpecPreset"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSpecPreset_B_index" ON "_ProductToSpecPreset"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("specPresetId") REFERENCES "SpecPreset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSpecPreset" ADD FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSpecPreset" ADD FOREIGN KEY ("B") REFERENCES "SpecPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
