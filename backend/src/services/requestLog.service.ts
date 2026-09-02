import {
    Prisma,
  } from "@prisma/client";
  
  import {
    prisma,
  } from "../config/prisma";
  
  
  type CreateRequestLogInput = {
    projectId: string;
    apiKeyId?: string;
  
    decision:
      | "ALLOWED"
      | "BLOCKED"
      | "ERROR";
  
    stage:
      | "AUTH"
      | "RATE_LIMIT"
      | "INPUT_SECURITY"
      | "LLM"
      | "OUTPUT_SECURITY"
      | "COMPLETED";
  
    model?: string;
  
    processedPrompt?: string;
    responsePreview?: string;
  
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  
    latencyMs?: number;
  
    estimatedCostUsd?: number;
  
    inputFindings?: Prisma.InputJsonValue;
    outputFindings?: Prisma.InputJsonValue;
  };
  
  
  export async function createRequestLog(
    data: CreateRequestLogInput
  ) {
    return prisma.requestLog.create({
      data: {
        projectId:
          data.projectId,
  
        apiKeyId:
          data.apiKeyId,
  
        decision:
          data.decision,
  
        stage:
          data.stage,
  
        model:
          data.model,
  
        processedPrompt:
          data.processedPrompt,
  
        responsePreview:
          data.responsePreview,
  
        inputTokens:
          data.inputTokens ?? 0,
  
        outputTokens:
          data.outputTokens ?? 0,
  
        totalTokens:
          data.totalTokens ?? 0,
  
        latencyMs:
          data.latencyMs,
  
        estimatedCostUsd:
          data.estimatedCostUsd ?? 0,
  
        inputFindings:
          data.inputFindings,
  
        outputFindings:
          data.outputFindings,
      },
    });
  }
  
  
  export async function getRequestLogs(
    projectId: string
  ) {
    return prisma.requestLog.findMany({
      where: {
        projectId,
      },
  
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
  
        apiKey: {
          select: {
            id: true,
            name: true,
            keyPrefix: true,
          },
        },
      },
  
      orderBy: {
        createdAt: "desc",
      },
  
      take: 100,
    });
  }
  
  
  export async function getRequestLogById(
    id: string
  ) {
    return prisma.requestLog.findUnique({
      where: {
        id,
      },
  
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
  
        apiKey: {
          select: {
            id: true,
            name: true,
            keyPrefix: true,
          },
        },
      },
    });
  }