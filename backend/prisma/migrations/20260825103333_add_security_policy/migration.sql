-- CreateEnum
CREATE TYPE "SecurityAction" AS ENUM ('BLOCK', 'WARN', 'MASK', 'ALLOW');

-- CreateTable
CREATE TABLE "SecurityPolicy" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "promptInjectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "promptInjectionAction" "SecurityAction" NOT NULL DEFAULT 'BLOCK',
    "piiDetectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "piiDetectionAction" "SecurityAction" NOT NULL DEFAULT 'WARN',
    "secretDetectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "secretDetectionAction" "SecurityAction" NOT NULL DEFAULT 'BLOCK',
    "outputScanningEnabled" BOOLEAN NOT NULL DEFAULT true,
    "outputScanningAction" "SecurityAction" NOT NULL DEFAULT 'WARN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecurityPolicy_projectId_key" ON "SecurityPolicy"("projectId");

-- AddForeignKey
ALTER TABLE "SecurityPolicy" ADD CONSTRAINT "SecurityPolicy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
