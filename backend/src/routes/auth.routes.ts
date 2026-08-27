import {
    Router,
  } from "express";
  
  import {
    getCurrentUserController,
    loginController,
    registerController,
  } from "../controllers/auth.controller";
  
  import {
    requireAuth,
  } from "../middleware/auth";
  
  const router =
    Router();
  
  
  router.post(
    "/register",
    registerController
  );
  
  
  router.post(
    "/login",
    loginController
  );
  
  
  router.get(
    "/me",
    requireAuth,
    getCurrentUserController
  );
  
  
  export default router;