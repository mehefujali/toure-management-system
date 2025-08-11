import AppErr from "../../errorhelpers/AppError";
import { User } from "./user.model";
import { IAuthProvider, IUser } from "./usre.interface";
import httpstatus from "http-status-codes";
import bcryptjs from "bcryptjs";
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
  const users = await User.find();
  const userCount = await User.countDocuments();
  return {
    data: users,
    meta: userCount,
  };
};

export const userService = {
  createUser,
  getAllUser,
};
