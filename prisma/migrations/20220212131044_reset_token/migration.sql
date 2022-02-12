-- CreateTable
CREATE TABLE "ResetToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("id")
);
