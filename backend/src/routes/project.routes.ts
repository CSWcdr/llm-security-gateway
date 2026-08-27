import {
    Router,
  } from "express";
  
  import {
    createProjectController,
    deleteProjectController,
    getProjectByIdController,
    getProjectsController,
    updateProjectController,
  } from "../controllers/project.controller";
  
  import {
    requireAuth,
  } from "../middleware/auth";
  
  const router =
    Router();
  
  
  /*
   * Every project-management
   * endpoint requires user login.
   */
  router.use(
    requireAuth
  );
  
  
  router.post(
    "/",
    createProjectController
  );
  
  
  router.get(
    "/",
    getProjectsController
  );
  
  
  router.get(
    "/:id",
    getProjectByIdController
  );
  
  
  router.patch(
    "/:id",
    updateProjectController
  );
  
  
  router.delete(
    "/:id",
    deleteProjectController
  );
  
  
  export default router;