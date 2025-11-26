/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppErr from "../../errorhelpers/AppError";
import { User } from "../user/user.model";
import { IUser } from "../user/usre.interface";
import httpstatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

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
  const { accessToken, refreshToken } = createUserTokens(existingUser);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = existingUser.toObject();
  return {
    accessToken,
    refreshToken,
    user: rest,
  };
};
const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};
const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isPasswrdMatch = await bcryptjs.compare(
    oldPassword,
    user!.password as string
  );

  if (!isPasswrdMatch) {
    throw new AppErr(httpstatus.UNAUTHORIZED, "Old password is incorrect.");
  }
  user!.password = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user!.save();

  return true;
};
export const authServices = {
  credentialLogin,
  getNewAccessToken,
  changePassword,
};
