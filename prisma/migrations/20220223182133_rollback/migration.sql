-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "sortOrder" SET DEFAULT 1,
ALTER COLUMN "sortOrder" DROP DEFAULT;
DROP SEQUENCE "productimage_sortorder_seq";
