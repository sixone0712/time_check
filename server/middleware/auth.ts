import { NextFunction, Request, Response } from 'express';
import { getToken } from 'next-auth/jwt';
import { UserToken } from 'server/types/common';
import jwt from 'jsonwebtoken';

export const authToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const headerToken = req.headers.authorization?.replace('Bearer ', '');

  if (sessionToken?.name as unknown as UserToken) {
    req.user = sessionToken?.name as unknown as UserToken;
  }

  if (headerToken) {
    const decodedToken = jwt.verify(
      headerToken,
      process.env.NEXTAUTH_SECRET as string
    ) as jwt.JwtPayload;
    req.user = decodedToken['name'] as UserToken;
  }

  console.log('req.user', req.user);
  if (req.user) {
    return next();
  } else {
    return res.status(401).send('Unauthorized');
  }
};
