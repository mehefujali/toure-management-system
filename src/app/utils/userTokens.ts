import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/usre.interface";
import { genarateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppErr from "../errorhelpers/AppError";
import httpstatus from "http-status-codes";

export const createUserTokens = (
  user: Partial<IUser>
): { accessToken: string; refreshToken: string } => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = genarateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXP
  );
  const refreshToken = genarateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXP
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifyedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;
  const isUserExist = await User.findOne({
    email: verifyedRefreshToken.email,
  });
  if (!isUserExist) {
    throw new AppErr(httpstatus.NOT_FOUND, "User not found");
  }
  if (isUserExist?.isActive === IsActive.BLOCKED) {
    throw new AppErr(httpstatus.BAD_REQUEST, "User account blocked");
  }
  if (isUserExist?.isDeleted) {
    throw new AppErr(httpstatus.BAD_REQUEST, "User is deleted");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = genarateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXP
  );
  return accessToken;
};
