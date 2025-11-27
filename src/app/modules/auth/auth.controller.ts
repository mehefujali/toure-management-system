import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import AppErr from "../../errorhelpers/AppError";
import { envVars } from "../../config/env";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await authServices.credentialLogin(req.body);
  res.cookie("refreshToken", loginInfo.refreshToken, {
    httpOnly: true,
    secure: false,
  });
  res.cookie("accessToken", loginInfo.accessToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: loginInfo,
  });
});
const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  const tokenInfo = await authServices.getNewAccessToken(refreshToken);
  res.cookie("accessToken", tokenInfo.accessToken, {
    httpOnly: true,
    secure: false,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "New access token retrive successfully",
    data: tokenInfo,
  });
});
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "user logedout successfully",
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const decodedToken = req.user as JwtPayload;

  await authServices.changePassword(oldPassword, newPassword, decodedToken);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User pssword changed successfully",
  });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new AppErr(StatusCodes.NOT_FOUND, "User not found");
  }
  const tokenInfo = createUserTokens(user);
  res.cookie("refreshToken", tokenInfo.refreshToken, {
    httpOnly: true,
    secure: false,
  });
  res.cookie("accessToken", tokenInfo.accessToken, {
    httpOnly: true,
    secure: false,
  });
  res.redirect(envVars.FRONTEND_URL);
});

export const authControllers = {
  credentialLogin,
  getNewAccessToken,
  logout,
  changePassword,
  googleCallback,
};
