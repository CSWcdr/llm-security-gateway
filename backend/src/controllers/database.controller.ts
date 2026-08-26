import type {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import { prisma } from "../config/prisma";
  
  export async function getDatabaseHealth(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await prisma.$queryRaw`
        SELECT 1
      `;
  
      res.status(200).json({
        success: true,
  
        message:
          "Database connection is healthy.",
  
        data: {
          database: "PostgreSQL",
          provider: "Neon",
          status: "connected",
          timestamp:
            new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }