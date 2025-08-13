/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { envVars } from "../../config/env";
import { verifyToken } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, ...rest } = req.body;
    const user = await userService.createUser({ name, email, ...rest });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User create success",
      user,
    });
  }
);
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const token = req.headers.authorization as string;
    const varifyedToken = req.user;
    const user = await userService.updateUser(
      id,
      req.body,
      varifyedToken as JwtPayload
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUser();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User fetch successfully",
      data: users.data,
      meta: { total: users.meta },
    });
  }
);

export const userController = {
  createUser,
  getAllUser,
  updateUser,
};
