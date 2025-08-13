import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
export const genarateToken = (
  payload: JwtPayload,
  secret: string,
  expires: string
): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expires,
  } as SignOptions);
  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const isVerifyed = jwt.verify(token, secret);
  return isVerifyed;
};
