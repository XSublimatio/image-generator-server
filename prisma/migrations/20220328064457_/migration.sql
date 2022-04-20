-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "imgDone" BOOLEAN NOT NULL DEFAULT false,
    "vidDone" BOOLEAN NOT NULL DEFAULT false,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Queue_tokenId_key" ON "Queue"("tokenId");
