-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);
