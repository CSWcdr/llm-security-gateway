import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import {
    getOrCreateRateLimit,
  } from "../services/rateLimit.service";
  
  import {
    incrementRateCounter,
    type RateLimitWindow,
  } from "../services/rateLimiter.service";
  
  type LimitCheck = {
    window: RateLimitWindow;
    limit: number;
  };
  
  export async function gatewayRateLimiter(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const auth =
        res.locals.gatewayAuth;
  
      if (!auth?.projectId) {
        return res.status(401).json({
          success: false,
          message:
            "Gateway authentication required.",
        });
      }
  
      const rateLimit =
        await getOrCreateRateLimit(
          auth.projectId
        );
  
      if (!rateLimit.enabled) {
        return next();
      }
  
      const checks: LimitCheck[] = [
        {
          window: "burst",
          limit:
            rateLimit.burstLimit,
        },
        {
          window: "minute",
          limit:
            rateLimit.requestsPerMinute,
        },
        {
          window: "hour",
          limit:
            rateLimit.requestsPerHour,
        },
        {
          window: "day",
          limit:
            rateLimit.requestsPerDay,
        },
      ];
  
      for (const check of checks) {
        const {
          count,
          resetIn,
        } =
          await incrementRateCounter(
            auth.projectId,
            check.window
          );
  
        if (count > check.limit) {
          res.setHeader(
            "Retry-After",
            resetIn.toString()
          );
  
          return res.status(429).json({
            success: false,
  
            message:
              "Rate limit exceeded.",
  
            data: {
              window:
                check.window,
  
              limit:
                check.limit,
  
              current:
                count,
  
              retryAfterSeconds:
                resetIn,
            },
          });
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  }