import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status-codes";
import AppErr from "../errorhelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/usre.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppErr(httpstatus.UNAUTHORIZED, "Please Login first");
      }
      const verifyedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      const user = await User.findById(verifyedToken.userId);

      if (!user) {
        throw new AppErr(httpstatus.NOT_FOUND, "User not found");
      }
      if (user?.isActive === IsActive.BLOCKED) {
        throw new AppErr(httpstatus.BAD_REQUEST, "User account blocked");
      }
      if (user?.isDeleted) {
        throw new AppErr(httpstatus.BAD_REQUEST, "User is deleted");
      }
      if (!authRoles.includes(user?.role as string)) {
        throw new AppErr(httpstatus.UNAUTHORIZED, "You have not  access ");
      }
      req.user = verifyedToken;
      next();
    } catch (err) {
      next(err);
    }
  };
