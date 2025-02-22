import type { Request, Response } from "express";
import { Bearer } from "../shared/lib/jwt";

export const AuthMiddleware = async (req: Request, res: Response) => {
    const user = Bearer.verify(req.headers['authorization'], 'user');

    return user;
}