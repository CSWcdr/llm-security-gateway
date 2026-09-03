import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { prisma } from "../config/prisma";

export async function requireProjectOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectIdParam = req.params.projectId;

    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required.",
      });
    }

    const userId =
      res.locals.authUser.userId;

    const project =
      await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: userId,
        },

        select: {
          id: true,
        },
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireApiKeyOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = req.params.id;

    const id = Array.isArray(idParam)
      ? idParam[0]
      : idParam;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "API key ID is required.",
      });
    }

    const userId =
      res.locals.authUser.userId;

    const apiKey =
      await prisma.apiKey.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          project: {
            select: {
              ownerId: true,
            },
          },
        },
      });

    if (
      !apiKey ||
      apiKey.project.ownerId !== userId
    ) {
      return res.status(404).json({
        success: false,
        message: "API key not found.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

export async function requireRequestLogOwnership(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idParam = req.params.id;

    const id = Array.isArray(idParam)
      ? idParam[0]
      : idParam;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Request log ID is required.",
      });
    }

    const userId =
      res.locals.authUser.userId;

    const requestLog =
      await prisma.requestLog.findUnique({
        where: {
          id,
        },

        select: {
          id: true,

          project: {
            select: {
              ownerId: true,
            },
          },
        },
      });

    if (
      !requestLog ||
      requestLog.project.ownerId !== userId
    ) {
      return res.status(404).json({
        success: false,
        message: "Request log not found.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}