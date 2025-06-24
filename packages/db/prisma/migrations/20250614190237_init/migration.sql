-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "chatBotName" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "projectDescription" TEXT,
    "welcomeMessage" TEXT,
    "avatarImage" TEXT,
    "chatBotType" TEXT,
    "supportEmail" TEXT,
    "supportContact" TEXT,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Projects_userId_idx" ON "Projects"("userId");

-- CreateIndex
CREATE INDEX "Projects_websiteUrl_idx" ON "Projects"("websiteUrl");

-- CreateIndex
CREATE INDEX "Projects_chatBotType_idx" ON "Projects"("chatBotType");
