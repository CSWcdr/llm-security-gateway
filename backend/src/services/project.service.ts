import { prisma } from "../config/prisma";

type CreateProjectInput = {
  name: string;
  description?: string;
  environment:
    | "DEVELOPMENT"
    | "PRODUCTION";
  status:
    | "ACTIVE"
    | "PAUSED";
};

type UpdateProjectInput = {
  name?: string;
  description?: string;
  environment?:
    | "DEVELOPMENT"
    | "PRODUCTION";
  status?:
    | "ACTIVE"
    | "PAUSED";
};

export async function createProject(
  data: CreateProjectInput
) {
  return prisma.project.create({
    data,
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProjectById(
  id: string
) {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
}

export async function updateProject(
  id: string,
  data: UpdateProjectInput
) {
  return prisma.project.update({
    where: {
      id,
    },

    data,
  });
}

export async function deleteProject(
  id: string
) {
  return prisma.project.delete({
    where: {
      id,
    },
  });
}