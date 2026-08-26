import { prisma } from "../config/prisma";

type SecurityAction =
  | "BLOCK"
  | "WARN"
  | "MASK"
  | "ALLOW";

type UpdateSecurityPolicyInput = {
  promptInjectionEnabled?: boolean;
  promptInjectionAction?: SecurityAction;

  piiDetectionEnabled?: boolean;
  piiDetectionAction?: SecurityAction;

  secretDetectionEnabled?: boolean;
  secretDetectionAction?: SecurityAction;

  outputScanningEnabled?: boolean;
  outputScanningAction?: SecurityAction;
};

export async function getSecurityPolicy(
  projectId: string
) {
  return prisma.securityPolicy.findUnique({
    where: {
      projectId,
    },
  });
}

export async function createDefaultSecurityPolicy(
  projectId: string
) {
  return prisma.securityPolicy.create({
    data: {
      projectId,
    },
  });
}

export async function getOrCreateSecurityPolicy(
  projectId: string
) {
  const existingPolicy =
    await getSecurityPolicy(projectId);

  if (existingPolicy) {
    return existingPolicy;
  }

  return createDefaultSecurityPolicy(
    projectId
  );
}

export async function updateSecurityPolicy(
  projectId: string,
  data: UpdateSecurityPolicyInput
) {
  return prisma.securityPolicy.upsert({
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