import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    analyticsParamsSchema,
    analyticsQuerySchema,
  } from "../validators/analytics.validator";
  
  import {
    getAnalyticsDetails,
    getAnalyticsSummary,
  } from "../services/analytics.service";
  
  import {
    getProjectById,
  } from "../services/project.service";
  
  
  export async function getAnalyticsSummaryController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        analyticsParamsSchema.safeParse(
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
  
      const analytics =
        await getAnalyticsSummary(
          projectId
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Analytics summary fetched successfully.",
  
        data:
          analytics,
      });
    } catch (error) {
      next(error);
    }
  }
  
  
  export async function getAnalyticsDetailsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        analyticsParamsSchema.safeParse(
          req.params
        );
  
      if (
        !paramsValidation.success
      ) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid project ID.",
  
          errors:
            paramsValidation
              .error
              .flatten(),
        });
      }
  
  
      const queryValidation =
        analyticsQuerySchema.safeParse(
          req.query
        );
  
      if (
        !queryValidation.success
      ) {
        return res.status(400).json({
          success: false,
  
          message:
            "Invalid analytics query.",
  
          errors:
            queryValidation
              .error
              .flatten(),
        });
      }
  
  
      const projectId =
        paramsValidation
          .data
          .projectId;
  
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
  
  
      const analytics =
        await getAnalyticsDetails(
          projectId,
          queryValidation
            .data
            .days
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "Analytics details fetched successfully.",
  
        data:
          analytics,
      });
    } catch (error) {
      next(error);
    }
  }