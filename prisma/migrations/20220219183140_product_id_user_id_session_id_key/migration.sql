/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId,sessionId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "productId_userId_sessionId" ON "CartItem"("productId", "userId", "sessionId");
