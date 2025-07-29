import { Request, Response } from "express";
import { User } from "./user.model";
import httpstatus from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({
      name,
      email,
    });

    res.status(httpstatus.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(httpstatus.BAD_REQUEST).json({
      success: false,
      message: `Something wen wrong ${error.message}`,
    });
  }
};

export const userController = {
  createUser,
};
