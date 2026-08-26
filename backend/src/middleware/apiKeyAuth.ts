import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    getApiKeyByHash,
    updateApiKeyLastUsed,
  } from "../services/apiKey.service";
  
  import {
    hashApiKey,
  } from "../utils/apiKey";
  
  export async function apiKeyAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const rawApiKey =
        req.header("x-api-key");
  
      if (!rawApiKey) {
        return res.status(401).json({
          success: false,
          message:
            "API key is required.",
        });
      }
  
      const keyHash =
        hashApiKey(rawApiKey);
  
      const apiKey =
        await getApiKeyByHash(
          keyHash
        );
  
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid API key.",
        });
      }
  
      if (
        apiKey.status !== "ACTIVE"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "API key has been revoked.",
        });
      }
  
      if (
        apiKey.project.status !==
        "ACTIVE"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Project is not active.",
        });
      }
  
      await updateApiKeyLastUsed(
        apiKey.id
      );
  
      res.locals.gatewayAuth = {
        apiKeyId: apiKey.id,
        projectId: apiKey.projectId,
        projectName:
          apiKey.project.name,
      };
  
      next();
    } catch (error) {
      next(error);
    }
  }