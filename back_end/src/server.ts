import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import router from './routes/route'
import { ENV } from './config/env';

dotenv.config();

const app = express();
const PORT = ENV.PORT

app.use(express.json());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === ENV.FRONTEND_URL) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser(ENV.COOKIE_SECRET));

export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => ENV.CSRF_SECRET,
    getSessionIdentifier: (req: Request) => req.cookies?.refreshtoken || req.cookies?.refreshToken || req.cookies?.accesstoken || req.cookies?.accessToken || req.ip || 'anonymous_session',
    cookieName: 'x-csrf-token',
    cookieOptions: {
        httpOnly: true,
        sameSite: ENV.NODE_ENV === 'production' ? 'strict' : 'lax',
        secure: ENV.NODE_ENV === 'production',
        path: '/',
    },
    getCsrfTokenFromRequest: (req: Request) => (req.headers['x-csrf-token'] as string) || '',
});

app.get('/api/csrf-token', (req: Request, res: Response) => {
    const csrftoken = generateCsrfToken(req, res)
    res.json({ csrftoken })
})

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`server live on port ${PORT}`)
})