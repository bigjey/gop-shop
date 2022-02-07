-- CreateTable
CREATE TABLE "Spec" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecPreset" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpecPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecPresetGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "presetId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SpecPresetGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecPresetGroupItem" (
    "id" SERIAL NOT NULL,
    "presetGroupId" INTEGER NOT NULL,
    "specId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SpecPresetGroupItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpecValue" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "specPresetGroupItemId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ProductSpecValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Spec_name_key" ON "Spec"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpecPreset_name_key" ON "SpecPreset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpecPresetGroup_name_key" ON "SpecPresetGroup"("name");

-- AddForeignKey
ALTER TABLE "SpecPresetGroup" ADD CONSTRAINT "SpecPresetGroup_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "SpecPreset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecPresetGroupItem" ADD CONSTRAINT "SpecPresetGroupItem_specId_fkey" FOREIGN KEY ("specId") REFERENCES "SpecPresetGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecValue" ADD CONSTRAINT "ProductSpecValue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpecValue" ADD CONSTRAINT "ProductSpecValue_specPresetGroupItemId_fkey" FOREIGN KEY ("specPresetGroupItemId") REFERENCES "SpecPresetGroupItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
