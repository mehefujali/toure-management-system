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

export const userService = {
  createUser,
};
