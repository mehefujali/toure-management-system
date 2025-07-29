import { Request, Response } from "express";

import httpstatus from "http-status-codes";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(httpstatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const userController = {
  createUser,
};
