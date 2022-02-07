-- DropForeignKey
ALTER TABLE "SpecPresetGroupItem" DROP CONSTRAINT "SpecPresetGroupItem_specId_fkey";

-- AddForeignKey
ALTER TABLE "SpecPresetGroupItem" ADD CONSTRAINT "SpecPresetGroupItem_presetGroupId_fkey" FOREIGN KEY ("presetGroupId") REFERENCES "SpecPresetGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecPresetGroupItem" ADD CONSTRAINT "SpecPresetGroupItem_specId_fkey" FOREIGN KEY ("specId") REFERENCES "Spec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
