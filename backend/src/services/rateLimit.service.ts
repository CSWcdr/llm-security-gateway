import { prisma } from "../config/prisma";

type UpdateRateLimitInput = {
  enabled?: boolean;
  requestsPerMinute?: number;
  requestsPerHour?: number;
  requestsPerDay?: number;
  burstLimit?: number;
};

export async function getRateLimit(
  projectId: string
) {
  return prisma.rateLimit.findUnique({
    where: {
      projectId,
    },
  });
}

export async function createDefaultRateLimit(
  projectId: string
) {
  return prisma.rateLimit.create({
    data: {
      projectId,
    },
  });
}

export async function getOrCreateRateLimit(
  projectId: string
) {
  const existingRateLimit =
    await getRateLimit(projectId);

  if (existingRateLimit) {
    return existingRateLimit;
  }

  return createDefaultRateLimit(
    projectId
  );
}

export async function updateRateLimit(
  projectId: string,
  data: UpdateRateLimitInput
) {
  return prisma.rateLimit.upsert({
    where: {
      projectId,
    },

    update: data,

    create: {
      projectId,
      ...data,
    },
  });
}