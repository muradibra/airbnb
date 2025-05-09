import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IUser, UserRole } from "../types/user";

export const authorize = (options?: {
  isAdmin?: boolean;
  isHost?: boolean;
}) => {
  const isAdmin = !!options?.isAdmin;
  const isHost = !!options?.isHost;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Unauthorized!" });
        return;
      }

      if (!isAdmin && !isHost) {
        return next();
      }

      // Allow access if the user is an admin and admin access is required
      if (isAdmin && req.user?.role === UserRole.ADMIN) {
        return next();
      }

      // Allow access if the user is a host and host access is required
      if (isHost && req.user?.role === UserRole.HOST) {
        return next();
      }

      // If neither condition is met, deny access
      res.status(403).json({ message: "Forbidden! Insufficient permissions!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error!" });
    }
  };
};

export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(
    "local",
    function (err: Error, user: IUser, info: { message?: string }) {
      if (err) {
        res.status(500).json({ message: "Internal server error!" });
        return;
      }
      if (info?.message || !user) {
        res.status(401).json({ message: info?.message || "Unauthorized!" });
        return;
      }

      req.login(user, function (err) {
        if (err) {
          res.status(500).json({ message: "Internal server error!" });
          return;
        }
        next();
      });
    }
  )(req, res, next);
