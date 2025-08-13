import AppErr from "../../errorhelpers/AppError";
import { User } from "./user.model";
import { IAuthProvider, IUser, Role } from "./usre.interface";
import httpstatus, { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
const createUser = async (payload: Partial<IUser>) => {
  const { email, ...rest } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppErr(httpstatus.BAD_REQUEST, `${email} Email already exist`);
  }
  rest.password = await bcryptjs.hash(rest.password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "credential",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUser = async () => {
  const users = await User.find().select("-password");
  const userCount = await User.countDocuments();
  return {
    data: users,
    meta: userCount,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppErr(StatusCodes.NOT_FOUND, "User not found");
  }

  if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
    throw new AppErr(StatusCodes.FORBIDDEN, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  });
  return newUpdatedUser;
};

export const userService = {
  createUser,
  getAllUser,
  updateUser,
};
