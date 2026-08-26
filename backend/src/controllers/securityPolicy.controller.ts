import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    securityPolicyParamsSchema,
    updateSecurityPolicySchema,
  } from "../validators/securityPolicy.validator";
  
  import {
    getOrCreateSecurityPolicy,
    updateSecurityPolicy,
  } from "../services/securityPolicy.service";
  
  import {
    getProjectById,
  } from "../services/project.service";
  
  export async function getSecurityPolicyController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        securityPolicyParamsSchema.safeParse(
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
        await getProjectById(projectId);
  
      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }
  
      const securityPolicy =
        await getOrCreateSecurityPolicy(
          projectId
        );
  
      return res.status(200).json({
        success: true,
        message:
          "Security policy fetched successfully.",
        data: securityPolicy,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function updateSecurityPolicyController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        securityPolicyParamsSchema.safeParse(
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
        updateSecurityPolicySchema.safeParse(
          req.body
        );
  
      if (!bodyValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid security policy data.",
          errors:
            bodyValidation.error.flatten(),
        });
      }
  
      const projectId =
        paramsValidation.data.projectId;
  
      const project =
        await getProjectById(projectId);
  
      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found.",
        });
      }
  
      const securityPolicy =
        await updateSecurityPolicy(
          projectId,
          bodyValidation.data
        );
  
      return res.status(200).json({
        success: true,
        message:
          "Security policy updated successfully.",
        data: securityPolicy,
      });
    } catch (error) {
      next(error);
    }
  }