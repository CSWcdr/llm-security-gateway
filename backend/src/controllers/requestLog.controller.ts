import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    getProjectById,
  } from "../services/project.service";
  
  import {
    getRequestLogById,
    getRequestLogs,
  } from "../services/requestLog.service";
  
  import {
    requestLogIdSchema,
    requestLogsParamsSchema,
  } from "../validators/requestLog.validator";
  
  export async function getRequestLogsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        requestLogsParamsSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project ID.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const projectId =
        validation.data.projectId;
  
      const project =
        await getProjectById(
          projectId
        );
  
      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }
  
      const logs =
        await getRequestLogs(
          projectId
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Request logs fetched successfully.",
  
        data:
          logs,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function getRequestLogByIdController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        requestLogIdSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid request log ID.",
  
          errors:
            validation.error.flatten(),
        });
      }
  
      const log =
        await getRequestLogById(
          validation.data.id
        );
  
      if (!log) {
        return res.status(404).json({
          success: false,
          message:
            "Request log not found.",
        });
      }
  
      return res.status(200).json({
        success: true,
  
        message:
          "Request log fetched successfully.",
  
        data:
          log,
      });
    } catch (error) {
      next(error);
    }
  }