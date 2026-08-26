-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requestsPerMinute" INTEGER NOT NULL DEFAULT 60,
    "requestsPerHour" INTEGER NOT NULL DEFAULT 1000,
    "requestsPerDay" INTEGER NOT NULL DEFAULT 10000,
    "burstLimit" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_projectId_key" ON "RateLimit"("projectId");

-- AddForeignKey
ALTER TABLE "RateLimit" ADD CONSTRAINT "RateLimit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
