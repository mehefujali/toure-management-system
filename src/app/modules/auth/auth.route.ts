import { Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/usre.interface";
const router = Router();

router.post("/login", authControllers.credentialLogin);
router.get("/refresh-token", authControllers.getNewAccessToken);
router.get(
  "/logout",
  checkAuth(...Object.values(Role)),
  authControllers.logout
);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  authControllers.changePassword
);

export const authRoutes = router;
