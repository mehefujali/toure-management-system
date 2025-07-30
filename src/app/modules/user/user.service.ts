import { User } from "./user.model";
import { IUser } from "./usre.interface";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
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
