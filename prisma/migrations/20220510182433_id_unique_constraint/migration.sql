/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `UserAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "id_userId" ON "UserAddress"("id", "userId");
