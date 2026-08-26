-- CreateEnum
CREATE TYPE "RequestDecision" AS ENUM ('ALLOWED', 'BLOCKED', 'ERROR');

-- CreateEnum
CREATE TYPE "RequestStage" AS ENUM ('AUTH', 'RATE_LIMIT', 'INPUT_SECURITY', 'LLM', 'OUTPUT_SECURITY', 'COMPLETED');

-- CreateTable
CREATE TABLE "RequestLog" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "decision" "RequestDecision" NOT NULL,
    "stage" "RequestStage" NOT NULL,
    "model" TEXT,
    "processedPrompt" TEXT,
    "responsePreview" TEXT,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER,
    "estimatedCostUsd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inputFindings" JSONB,
    "outputFindings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestLog_projectId_idx" ON "RequestLog"("projectId");

-- CreateIndex
CREATE INDEX "RequestLog_apiKeyId_idx" ON "RequestLog"("apiKeyId");

-- CreateIndex
CREATE INDEX "RequestLog_decision_idx" ON "RequestLog"("decision");

-- CreateIndex
CREATE INDEX "RequestLog_stage_idx" ON "RequestLog"("stage");

-- CreateIndex
CREATE INDEX "RequestLog_createdAt_idx" ON "RequestLog"("createdAt");

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestLog" ADD CONSTRAINT "RequestLog_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
