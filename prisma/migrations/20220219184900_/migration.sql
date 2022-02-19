/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,sessionId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "productId_userId_sessionId";

-- CreateIndex
CREATE UNIQUE INDEX "productId_userId" ON "CartItem"("productId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "productId_sessionId" ON "CartItem"("productId", "sessionId");
