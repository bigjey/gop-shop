-- AlterTable
CREATE SEQUENCE "productimage_sortorder_seq";
ALTER TABLE "ProductImage" ALTER COLUMN "sortOrder" SET DEFAULT nextval('productimage_sortorder_seq');
ALTER SEQUENCE "productimage_sortorder_seq" OWNED BY "ProductImage"."sortOrder";
