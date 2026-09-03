import { api } from "../lib/api";

export type AnalyticsSummary = {
  totalRequests: number;

  allowedRequests: number;

  blockedRequests: number;

  errorRequests: number;

  blockRate: number;

  tokens: {
    input: number;
    output: number;
    total: number;
  };

  averageLatencyMs: number;

  totalEstimatedCostUsd: number;
};

export type AnalyticsDetails = {
  periodDays: number;

  decisionBreakdown: {
    allowed: number;
    blocked: number;
    error: number;
  };

  modelUsage: {
    model: string;
    requests: number;
    tokens: number;
    costUsd: number;
  }[];

  dailyTrend: {
    date: string;
    requests: number;
    allowed: number;
    blocked: number;
    errors: number;
    tokens: number;
    costUsd: number;
    averageLatencyMs: number;
  }[];
};

type AnalyticsSummaryResponse = {
  success: true;

  message: string;

  data: AnalyticsSummary;
};

type AnalyticsDetailsResponse = {
  success: true;

  message: string;

  data: AnalyticsDetails;
};

export async function getAnalyticsSummary(
  projectId: string
): Promise<AnalyticsSummary> {
  const response =
    await api.get<AnalyticsSummaryResponse>(
      `/projects/${projectId}/analytics/summary`
    );

  return response.data.data;
}

export async function getAnalyticsDetails(
  projectId: string,
  days: number = 7
): Promise<AnalyticsDetails> {
  const response =
    await api.get<AnalyticsDetailsResponse>(
      `/projects/${projectId}/analytics/details`,
      {
        params: {
          days,
        },
      }
    );

  return response.data.data;
}