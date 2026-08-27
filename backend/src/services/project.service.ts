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

  ownerId: string;
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


/*
 * Used by authenticated
 * project-list endpoints.
 */
export async function getProjectsByOwner(
  ownerId: string
) {
  return prisma.project.findMany({
    where: {
      ownerId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}


/*
 * Used by authenticated
 * project-detail endpoints.
 */
export async function getProjectByIdForOwner(
  id: string,
  ownerId: string
) {
  return prisma.project.findFirst({
    where: {
      id,
      ownerId,
    },
  });
}


/*
 * Keep this generic lookup because
 * other internal gateway services
 * currently use it.
 */
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