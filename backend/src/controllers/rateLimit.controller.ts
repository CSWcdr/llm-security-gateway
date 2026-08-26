import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    rateLimitParamsSchema,
    updateRateLimitSchema,
  } from "../validators/rateLimit.validator";
  
  import {
    getOrCreateRateLimit,
    updateRateLimit,
  } from "../services/rateLimit.service";
  
  import {
    getProjectById,
  } from "../services/project.service";
  
  export async function getRateLimitController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        rateLimitParamsSchema.safeParse(
          req.params
        );
  
      if (!paramsValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
          errors:
            paramsValidation.error.flatten(),
        });
      }
  
      const projectId =
        paramsValidation.data.projectId;
  
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
  
      const rateLimit =
        await getOrCreateRateLimit(
          projectId
        );
  
      return res.status(200).json({
        success: true,
        message:
          "Rate limit fetched successfully.",
        data: rateLimit,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function updateRateLimitController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        rateLimitParamsSchema.safeParse(
          req.params
        );
  
      if (!paramsValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID.",
          errors:
            paramsValidation.error.flatten(),
        });
      }
  
      const bodyValidation =
        updateRateLimitSchema.safeParse(
          req.body
        );
  
      if (!bodyValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid rate limit data.",
          errors:
            bodyValidation.error.flatten(),
        });
      }
  
      const projectId =
        paramsValidation.data.projectId;
  
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
  
      const rateLimit =
        await updateRateLimit(
          projectId,
          bodyValidation.data
        );
  
      return res.status(200).json({
        success: true,
        message:
          "Rate limit updated successfully.",
        data: rateLimit,
      });
    } catch (error) {
      next(error);
    }
  }