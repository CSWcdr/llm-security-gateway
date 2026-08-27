import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    verifyAccessToken,
  } from "../utils/jwt";
  
  export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authorization =
        req.header("authorization");
  
      if (!authorization) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }
  
      const [
        scheme,
        token,
      ] =
        authorization.split(" ");
  
      if (
        scheme !== "Bearer" ||
        !token
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid authorization header.",
        });
      }
  
      const payload =
        verifyAccessToken(
          token
        );
  
      res.locals.authUser = {
        userId:
          payload.userId,
  
        email:
          payload.email,
  
        role:
          payload.role,
      };
  
      next();
    } catch {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token.",
      });
    }
  }