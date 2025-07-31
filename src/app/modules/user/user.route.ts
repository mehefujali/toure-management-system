import {  Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequrest } from "../../middlewares/validateRequest";



const router = Router();

router.post(
  "/register",validateRequrest(createUserZodSchema),
  userController.createUser
);
router.get("/", userController.getAllUser);

export const userRoutes = router;
