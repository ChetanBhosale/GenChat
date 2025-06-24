/*
  Warnings:

  - You are about to drop the column `chatBotName` on the `Projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[websiteUrl]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatbotName` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "chatBotName",
ADD COLUMN     "chatbotName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Projects_websiteUrl_key" ON "Projects"("websiteUrl");
