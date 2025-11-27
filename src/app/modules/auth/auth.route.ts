import { NextFunction, Request, Response, Router } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/usre.interface";
import passport from "passport";
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
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = (req.query.redirect as string) || "/";

  passport.authenticate("google", {
    scope: ["email", "profile"],
    state: redirect,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authControllers.googleCallback
);

export const authRoutes = router;
