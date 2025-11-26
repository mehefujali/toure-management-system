import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppErr from "../errorhelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppErr(StatusCodes.UNAUTHORIZED, "Please Login first");
      }
      const verifyedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const user = await User.findById(verifyedToken.userId);

      if (!authRoles.includes(user?.role as string)) {
        throw new AppErr(StatusCodes.UNAUTHORIZED, "You have not  access ");
      }
      req.user = verifyToken;
      next();
    } catch (err) {
      next(err);
    }
  };
