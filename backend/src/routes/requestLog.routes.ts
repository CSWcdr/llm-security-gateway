import {
    Router,
  } from "express";
  
  import {
    getRequestLogByIdController,
    getRequestLogsController,
  } from "../controllers/requestLog.controller";
  
  const router =
    Router();
  
  router.get(
    "/projects/:projectId/logs",
    getRequestLogsController
  );
  
  router.get(
    "/logs/:id",
    getRequestLogByIdController
  );
  
  export default router;