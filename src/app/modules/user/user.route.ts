import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequrest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./usre.interface";

const router = Router();

router.post(
  "/register",
  validateRequrest(createUserZodSchema),
  userController.createUser
);
router.get("/", checkAuth(Role.ADMIN), userController.getAllUser);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userController.updateUser
);

export const userRoutes = router;
