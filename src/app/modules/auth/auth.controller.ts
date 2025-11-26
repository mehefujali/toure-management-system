import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

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

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Refresh token fetch successfully",
    data: tokenInfo,
  });
});

export const authControllers = {
  credentialLogin,
  getNewAccessToken,
};
