import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { ENV } from "../config/env";

export interface tokenpayload {
    id: number;
    email: string;
    role: 'admin' | 'scrap_collector' | 'customer' | 'moderator'
}
declare global {
    namespace Express {
        interface Request {
            user?: tokenpayload
        }
    }
}

export const verifytoken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.accessToken || req.cookies?.accesstoken || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : undefined);

    if (!token) {
        res.status(401).json({ message: 'no token found' })
        return
    }

    const accesssecret = ENV.ACCESS_SECRET

    jwt.verify(token, accesssecret, (err: any, decoded: any) => {
        if (err) {
            res.status(401).json({ message: 'authentication error: no cookies found' })
            return
        }

        req.user = decoded as tokenpayload
        next()
    })
}

export const requireadmin = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        res.status(401).json({ message: 'only  admins and moderators are authrized to access' })
        return
    }
    next()
}

export const requireadminonly = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
        res.status(401).json({ message: 'only  admins are authrized to access' })
        return
    }
    next()
}


