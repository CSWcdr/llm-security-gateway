import jwt from "jsonwebtoken";

import {
  env,
} from "../config/env";

type TokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export function generateAccessToken(
  payload: TokenPayload
) {
  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn:
        env.JWT_EXPIRES_IN_SECONDS,
    }
  );
}

export function verifyAccessToken(
  token: string
) {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as TokenPayload &
    jwt.JwtPayload;
}