// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";

// // Optionally define a custom type for the user payload
// interface JwtPayload {
//   id: string;
//   username: string;
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     res.sendStatus(401); // Unauthorized
//     return;
//   }

//   jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
//     if (err) {
//       res.sendStatus(403); // Forbidden
//       return;
//     }

//     // Attach user info to request (you may need to extend Request type to avoid TS error)
//     (req as any).user = decoded as JwtPayload;
//     next();
//   });
// };

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend Request type
interface AuthenticatedRequest extends Request {
  user?: { id: string; [key: string]: any };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // ✅ Mock token for testing
  if (token === "testuser") {
    req.user = { id: "mockUserId" };
    return next();
  }

  // ✅ Real JWT verification
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded !== "object" || !("id" in decoded)) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded as { id: string };
    next();
  });
};


