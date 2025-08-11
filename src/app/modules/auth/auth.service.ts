import AppErr from "../../errorhelpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/usre.interface";
import httpstatus from "http-status-codes";
import bcryptjs from "bcryptjs";

const credentialLogin = async (paylod: Partial<IUser>) => {
  const { email, password } = paylod;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new AppErr(httpstatus.NOT_FOUND, `${email} Email does not exist`);
  }

  const isPasswrdMatch = await bcryptjs.compare(
    password as string,
    existingUser.password as string
  );

  if (!isPasswrdMatch) {
    throw new AppErr(httpstatus.UNAUTHORIZED, "Invalid Password");
  }

  return {
    email: existingUser.email,
  };
};

export const authServices = {
  credentialLogin,
};
