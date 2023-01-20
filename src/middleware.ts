import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export function verifyToken(req: any, res: any, next: any) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send({ message: "No token provided" });

  jwt.verify(authorization, TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).send({ message: "Token expired" });
      } else if (err instanceof JsonWebTokenError) {
        return res.status(401).send({ message: "Invalid token" });
      }
    }
    req.user = decoded.data;
    next();
  });
}
