import { Router } from "express";
import { authControllers } from "./auth.controller";
const router = Router();

router.post("/login", authControllers.credentialLogin);
router.get("/refresh-token", authControllers.getNewAccessToken);

export const authRoutes = router;
