import type {
    Request,
    Response,
  } from "express";
  
  export function getHealth(
    _req: Request,
    res: Response
  ) {
    res.status(200).json({
      success: true,
  
      message:
        "LLM Security Gateway backend is running.",
  
      data: {
        status: "healthy",
  
        uptime:
          process.uptime(),
  
        timestamp:
          new Date().toISOString(),
      },
    });
  }