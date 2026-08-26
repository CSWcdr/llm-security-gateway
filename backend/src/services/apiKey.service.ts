import { prisma } from "../config/prisma";

type CreateApiKeyInput = {
  name: string;
  projectId: string;
  keyPrefix: string;
  keyHash: string;
};

export async function createApiKey(
  data: CreateApiKeyInput
) {
  return prisma.apiKey.create({
    data,

    select: {
      id: true,
      name: true,
      keyPrefix: true,
      status: true,
      projectId: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getApiKeysByProject(
  projectId: string
) {
  return prisma.apiKey.findMany({
    where: {
      projectId,
    },

    select: {
      id: true,
      name: true,
      keyPrefix: true,
      status: true,
      projectId: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getApiKeyById(
  id: string
) {
  return prisma.apiKey.findUnique({
    where: {
      id,
    },
  });
}

export async function getApiKeyByHash(
  keyHash: string
) {
  return prisma.apiKey.findUnique({
    where: {
      keyHash,
    },

    include: {
      project: true,
    },
  });
}

export async function updateApiKeyLastUsed(
  id: string
) {
  return prisma.apiKey.update({
    where: {
      id,
    },

    data: {
      lastUsedAt: new Date(),
    },
  });
}

export async function revokeApiKey(
  id: string
) {
  return prisma.apiKey.update({
    where: {
      id,
    },

    data: {
      status: "REVOKED",
      revokedAt: new Date(),
    },

    select: {
      id: true,
      name: true,
      keyPrefix: true,
      status: true,
      projectId: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteApiKey(
  id: string
) {
  return prisma.apiKey.delete({
    where: {
      id,
    },
  });
}