-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('new', 'pending', 'proofed');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "rating" DECIMAL(65,30) DEFAULT 0.0;

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT E'new',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
