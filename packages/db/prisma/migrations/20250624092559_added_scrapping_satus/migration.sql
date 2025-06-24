-- CreateTable
CREATE TABLE "ScrappedStatus" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "success" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "pages" INTEGER NOT NULL,
    "Errors" INTEGER NOT NULL,
    "total_words" INTEGER NOT NULL,
    "current" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrappedStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrappedLinks" (
    "id" TEXT NOT NULL,
    "urls" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "scrappedId" TEXT NOT NULL,

    CONSTRAINT "ScrappedLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScrappedLinks_scrappedId_idx" ON "ScrappedLinks"("scrappedId");

-- AddForeignKey
ALTER TABLE "ScrappedStatus" ADD CONSTRAINT "ScrappedStatus_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrappedLinks" ADD CONSTRAINT "ScrappedLinks_scrappedId_fkey" FOREIGN KEY ("scrappedId") REFERENCES "ScrappedStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
