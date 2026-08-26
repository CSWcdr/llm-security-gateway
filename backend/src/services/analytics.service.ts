import {
    prisma,
  } from "../config/prisma";
  
  
  export async function getAnalyticsSummary(
    projectId: string
  ) {
    const [
      totalRequests,
      allowedRequests,
      blockedRequests,
      errorRequests,
      aggregateData,
    ] =
      await Promise.all([
        prisma.requestLog.count({
          where: {
            projectId,
          },
        }),
  
        prisma.requestLog.count({
          where: {
            projectId,
            decision: "ALLOWED",
          },
        }),
  
        prisma.requestLog.count({
          where: {
            projectId,
            decision: "BLOCKED",
          },
        }),
  
        prisma.requestLog.count({
          where: {
            projectId,
            decision: "ERROR",
          },
        }),
  
        prisma.requestLog.aggregate({
          where: {
            projectId,
          },
  
          _sum: {
            inputTokens: true,
            outputTokens: true,
            totalTokens: true,
            estimatedCostUsd: true,
          },
  
          _avg: {
            latencyMs: true,
          },
        }),
      ]);
  
    const blockRate =
      totalRequests > 0
        ? (
            blockedRequests /
            totalRequests
          ) * 100
        : 0;
  
    return {
      totalRequests,
  
      allowedRequests,
  
      blockedRequests,
  
      errorRequests,
  
      blockRate:
        Number(
          blockRate.toFixed(2)
        ),
  
      tokens: {
        input:
          aggregateData
            ._sum
            .inputTokens ?? 0,
  
        output:
          aggregateData
            ._sum
            .outputTokens ?? 0,
  
        total:
          aggregateData
            ._sum
            .totalTokens ?? 0,
      },
  
      averageLatencyMs:
        Math.round(
          aggregateData
            ._avg
            .latencyMs ?? 0
        ),
  
      totalEstimatedCostUsd:
        aggregateData
          ._sum
          .estimatedCostUsd ?? 0,
    };
  }
  
  
  export async function getAnalyticsDetails(
    projectId: string,
    days: number
  ) {
    const startDate =
      new Date();
  
    startDate.setUTCDate(
      startDate.getUTCDate() -
        (days - 1)
    );
  
    startDate.setUTCHours(
      0,
      0,
      0,
      0
    );
  
    const logs =
      await prisma.requestLog.findMany({
        where: {
          projectId,
  
          createdAt: {
            gte: startDate,
          },
        },
  
        select: {
          decision: true,
          model: true,
          totalTokens: true,
          estimatedCostUsd: true,
          latencyMs: true,
          createdAt: true,
        },
  
        orderBy: {
          createdAt: "asc",
        },
      });
  
  
    /*
     * DECISION BREAKDOWN
     */
    const decisionBreakdown = {
      allowed: 0,
      blocked: 0,
      error: 0,
    };
  
    for (const log of logs) {
      if (
        log.decision === "ALLOWED"
      ) {
        decisionBreakdown.allowed += 1;
      }
  
      if (
        log.decision === "BLOCKED"
      ) {
        decisionBreakdown.blocked += 1;
      }
  
      if (
        log.decision === "ERROR"
      ) {
        decisionBreakdown.error += 1;
      }
    }
  
  
    /*
     * MODEL USAGE
     */
    const modelMap =
      new Map<
        string,
        {
          requests: number;
          tokens: number;
          costUsd: number;
        }
      >();
  
    for (const log of logs) {
      if (!log.model) {
        continue;
      }
  
      const existing =
        modelMap.get(
          log.model
        ) ?? {
          requests: 0,
          tokens: 0,
          costUsd: 0,
        };
  
      existing.requests += 1;
  
      existing.tokens +=
        log.totalTokens;
  
      existing.costUsd +=
        log.estimatedCostUsd;
  
      modelMap.set(
        log.model,
        existing
      );
    }
  
    const modelUsage =
      Array.from(
        modelMap.entries()
      ).map(
        ([model, values]) => ({
          model,
          requests:
            values.requests,
          tokens:
            values.tokens,
          costUsd:
            values.costUsd,
        })
      );
  
  
    /*
     * DAILY TREND
     */
    const dailyMap =
      new Map<
        string,
        {
          requests: number;
          allowed: number;
          blocked: number;
          errors: number;
          tokens: number;
          costUsd: number;
          latencyTotal: number;
          latencyCount: number;
        }
      >();
  
  
    /*
     * Create empty entries so days
     * with zero requests still appear
     * on the frontend chart.
     */
    for (
      let index = 0;
      index < days;
      index += 1
    ) {
      const date =
        new Date(startDate);
  
      date.setUTCDate(
        startDate.getUTCDate() +
          index
      );
  
      const dateKey =
        date
          .toISOString()
          .slice(0, 10);
  
      dailyMap.set(
        dateKey,
        {
          requests: 0,
          allowed: 0,
          blocked: 0,
          errors: 0,
          tokens: 0,
          costUsd: 0,
          latencyTotal: 0,
          latencyCount: 0,
        }
      );
    }
  
  
    for (const log of logs) {
      const dateKey =
        log.createdAt
          .toISOString()
          .slice(0, 10);
  
      const day =
        dailyMap.get(
          dateKey
        );
  
      if (!day) {
        continue;
      }
  
      day.requests += 1;
  
      day.tokens +=
        log.totalTokens;
  
      day.costUsd +=
        log.estimatedCostUsd;
  
      if (
        log.decision ===
        "ALLOWED"
      ) {
        day.allowed += 1;
      }
  
      if (
        log.decision ===
        "BLOCKED"
      ) {
        day.blocked += 1;
      }
  
      if (
        log.decision ===
        "ERROR"
      ) {
        day.errors += 1;
      }
  
      if (
        log.latencyMs !== null
      ) {
        day.latencyTotal +=
          log.latencyMs;
  
        day.latencyCount += 1;
      }
    }
  
  
    const dailyTrend =
      Array.from(
        dailyMap.entries()
      ).map(
        ([date, values]) => ({
          date,
  
          requests:
            values.requests,
  
          allowed:
            values.allowed,
  
          blocked:
            values.blocked,
  
          errors:
            values.errors,
  
          tokens:
            values.tokens,
  
          costUsd:
            values.costUsd,
  
          averageLatencyMs:
            values.latencyCount > 0
              ? Math.round(
                  values.latencyTotal /
                    values.latencyCount
                )
              : 0,
        })
      );
  
  
    return {
      periodDays:
        days,
  
      decisionBreakdown,
  
      modelUsage,
  
      dailyTrend,
    };
  }