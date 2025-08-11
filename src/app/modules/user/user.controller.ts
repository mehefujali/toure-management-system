/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

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
};
