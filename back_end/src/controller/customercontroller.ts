import { Response, Request } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../db';
import { ENV } from "../config/env";
import { tokenpayload } from "../middleware/auth";

const accesssecret = ENV.ACCESS_SECRET
const refreshsecret = ENV.REFRESH_SECRET


const generateAccessToken = (payload: tokenpayload): string => {
    return jwt.sign(payload, accesssecret, { expiresIn: '15m' });
};

const generateREFRESHtoken = (payload: tokenpayload): string => {
    return jwt.sign(payload, refreshsecret, { expiresIn: '30d' })
}


const setauthcookies = (res: Response, accesstoken: string, refreshtoken: string) => {
    const isproduction = ENV.NODE_ENV === 'production'

    res.cookie('refreshtoken', refreshtoken, {
        httpOnly: true,
        secure: isproduction,
        sameSite: isproduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    res.cookie('accesstoken', accesstoken, {
        httpOnly: true,
        secure: isproduction,
        sameSite: isproduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000
    })
}


export const customerlogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, phone_number, identifier, password } = req.body
        const queryVal = email || phone_number || identifier

        const customer = await db('customer')
            .where(function () {
                if (queryVal) {
                    this.where({ email: queryVal }).orWhere({ phone_number: queryVal })
                }
            })
            .first()

        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            res.status(401).json({ message: 'invalid credentials' })
            return
        }

        const payload: tokenpayload = { id: customer.id, email: customer.email, role: customer.role }

        const accesstoken = generateAccessToken(payload)
        const refreshtoken = generateREFRESHtoken(payload)

        await db('refresh_token').insert({
            user_id: customer.id,
            role: customer.role,
            token: refreshtoken,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })

        setauthcookies(res, accesstoken, refreshtoken)

        res.json({
            user: { id: customer.id, email: customer.email, name: customer.name, phone_number: customer.phone_number, role: customer.role },
            token: accesstoken,
            success: true
        })
    }

    catch (err) {
        res.status(500).json({ message: 'server error', err })
    }
}

export const handlerefreshtokencustomer = async (req: Request, res: Response): Promise<void> => {
    const incomingrefreshtoken = req.cookies?.refreshtoken || req.cookies?.refreshToken
    if (!incomingrefreshtoken) {
        res.status(401).json({ message: 'refresh token not found' })
        return;
    }

    const refreshrecord = await db('refresh_token').where({ token: incomingrefreshtoken }).first()
    if (!refreshrecord || refreshrecord.role !== 'customer') {
        res.status(403).json({ message: 'invalid customer refresh record' })
        return
    }

    jwt.verify(incomingrefreshtoken, refreshsecret, async (err: any, decoded: any) => {
        if (err || decoded.role !== 'customer') {
            await db('refresh_token').where({ token: incomingrefreshtoken }).del()
            res.status(403).json({ message: 'expired or unauthorized refresh token' })
            return;
        }

        const payload: tokenpayload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        const newrefresh = generateREFRESHtoken(payload)
        const newaccess = generateAccessToken(payload)

        await db('refresh_token').where({ token: incomingrefreshtoken }).update({
            token: newrefresh,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        })

        setauthcookies(res, newaccess, newrefresh)

        res.json({ message: 'session renewed', success: true, user: { id: decoded.id, email: decoded.email, role: decoded.role } })
    })
}

export const customerlogout = async (req: Request, res: Response): Promise<void> => {
    const incomingrefreshtoken = req.cookies?.refreshtoken || req.cookies?.refreshToken
    if (incomingrefreshtoken) {
        await db('refresh_token').where({ token: incomingrefreshtoken }).del()
    }

    const isproduction = ENV.NODE_ENV === 'production'
    const clearOpts = {
        httpOnly: true,
        secure: isproduction,
        sameSite: isproduction ? ('strict' as const) : ('lax' as const),
        path: '/'
    }

    res.clearCookie('accesstoken', clearOpts)
    res.clearCookie('accessToken', clearOpts)
    res.clearCookie('refreshtoken', clearOpts)
    res.clearCookie('refreshToken', clearOpts)

    res.json({ success: true, message: 'Logged out successfully' })
}
