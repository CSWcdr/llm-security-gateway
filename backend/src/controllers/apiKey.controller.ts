import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    apiKeyIdSchema,
    createApiKeySchema,
    projectApiKeyParamsSchema,
  } from "../validators/apiKey.validator";
  
  import {
    createApiKey,
    deleteApiKey,
    getApiKeyById,
    getApiKeysByProject,
    revokeApiKey,
  } from "../services/apiKey.service";
  
  import {
    getProjectById,
  } from "../services/project.service";
  
  import {
    generateApiKey,
  } from "../utils/apiKey";
  
  export async function createApiKeyController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const paramsValidation =
        projectApiKeyParamsSchema.safeParse(
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
        createApiKeySchema.safeParse(
          req.body
        );
  
      if (!bodyValidation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid API key data.",
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
  
      const {
        rawKey,
        keyPrefix,
        keyHash,
      } = generateApiKey();
  
      const apiKey =
        await createApiKey({
          name:
            bodyValidation.data.name,
  
          projectId,
  
          keyPrefix,
  
          keyHash,
        });
  
      return res.status(201).json({
        success: true,
  
        message:
          "API key created successfully.",
  
        data: {
          ...apiKey,
  
          key: rawKey,
        },
  
        warning:
          "Save this API key now. It will not be shown again.",
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function getApiKeysController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        projectApiKeyParamsSchema.safeParse(
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
  
      const apiKeys =
        await getApiKeysByProject(
          projectId
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "API keys fetched successfully.",
  
        data: apiKeys,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function revokeApiKeyController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        apiKeyIdSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid API key ID.",
          errors:
            validation.error.flatten(),
        });
      }
  
      const id =
        validation.data.id;
  
      const existingApiKey =
        await getApiKeyById(
          id
        );
  
      if (!existingApiKey) {
        return res.status(404).json({
          success: false,
          message:
            "API key not found.",
        });
      }
  
      if (
        existingApiKey.status ===
        "REVOKED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "API key is already revoked.",
        });
      }
  
      const apiKey =
        await revokeApiKey(
          id
        );
  
      return res.status(200).json({
        success: true,
  
        message:
          "API key revoked successfully.",
  
        data: apiKey,
      });
    } catch (error) {
      next(error);
    }
  }
  
  export async function deleteApiKeyController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation =
        apiKeyIdSchema.safeParse(
          req.params
        );
  
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid API key ID.",
          errors:
            validation.error.flatten(),
        });
      }
  
      const id =
        validation.data.id;
  
      const existingApiKey =
        await getApiKeyById(
          id
        );
  
      if (!existingApiKey) {
        return res.status(404).json({
          success: false,
          message:
            "API key not found.",
        });
      }
  
      await deleteApiKey(
        id
      );
  
      return res.status(200).json({
        success: true,
  
        message:
          "API key deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }