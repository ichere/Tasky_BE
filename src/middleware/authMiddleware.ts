import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Optionally define a custom type for the user payload
interface JwtPayload {
  id: string;
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.sendStatus(401); // Unauthorized
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.sendStatus(403); // Forbidden
      return;
    }

    // Attach user info to request (you may need to extend Request type to avoid TS error)
    (req as any).user = decoded as JwtPayload;
    next();
  });
};
